const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const anchor = require('markdown-it-anchor');
const mathMarkdown = require('./scripts/math-markdown.js');
const fs = require('node:fs');
const path = require('node:path');

function imageDimensions(file) {
  const data = fs.readFileSync(file);
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return [data.readUInt32BE(16), data.readUInt32BE(20)];
  }
  if (data.toString('ascii', 0, 3) === 'GIF') return [data.readUInt16LE(6), data.readUInt16LE(8)];
  if (data[0] !== 0xff || data[1] !== 0xd8) return null;
  const startOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < data.length) {
    if (data[offset] !== 0xff) { offset++; continue; }
    const marker = data[offset + 1];
    const length = data.readUInt16BE(offset + 2);
    if (startOfFrame.has(marker)) return [data.readUInt16BE(offset + 7), data.readUInt16BE(offset + 5)];
    if (length < 2) break;
    offset += length + 2;
  }
  return null;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setServerOptions({ host: '127.0.0.1' });
  eleventyConfig.amendLibrary('md', (md) => {
    md.use(mathMarkdown);
    md.use(anchor, { permalink: anchor.permalink.linkInsideHeader({ symbol: '#', placement: 'after' }) });
    for (const name of ['heading_open', 'heading_close']) {
      const renderHeading = md.renderer.rules[name] || ((tokens, index, options, env, renderer) => renderer.renderToken(tokens, index, options));
      md.renderer.rules[name] = (tokens, index, options, env, renderer) => {
        const token = tokens[index];
        const level = Number(token.tag.slice(1));
        token.tag = 'h' + Math.min(level + 1, 6);
        return renderHeading(tokens, index, options, env, renderer);
      };
    }
    const renderImage = md.renderer.rules.image || ((tokens, index, options, env, renderer) => renderer.renderToken(tokens, index, options));
    md.renderer.rules.image = (tokens, index, options, env, renderer) => {
      const token = tokens[index];
      const titleAttribute = token.attrGet('title') || '';
      const src = token.attrGet('src') || '';
      if (src.startsWith('/assets/images/') && !token.attrGet('width')) {
        try {
          const file = path.join('src', src.slice(1));
          if (src.toLowerCase().endsWith('.svg')) {
            const svg = fs.readFileSync(file, 'utf8');
            const box = svg.match(/viewBox=["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
            if (box) {
              token.attrSet('width', String(Math.round(Number(box[1]))));
              token.attrSet('height', String(Math.round(Number(box[2]))));
            }
          } else {
            const size = imageDimensions(file);
            if (size) {
              token.attrSet('width', String(size[0]));
              token.attrSet('height', String(size[1]));
            }
          }
        } catch {}
      }
      token.attrSet('loading', 'lazy');
      token.attrSet('decoding', 'async');
      if (!titleAttribute.startsWith('notebook:')) return renderImage(tokens, index, options, env, renderer);
      token.attrs = (token.attrs || []).filter(([name]) => name !== 'title');
      const captionMatch = titleAttribute.match(/(?:^|;)caption=([^;]+)/);
      const creditMatch = titleAttribute.match(/(?:^|;)credit=([^;]+)/);
      let caption = captionMatch ? captionMatch[1] : '';
      let credit = creditMatch ? creditMatch[1] : '';
      try { caption = decodeURIComponent(caption); } catch {}
      try { credit = decodeURIComponent(credit); } catch {}
      const image = renderImage(tokens, index, options, env, renderer);
      const captionHtml = caption || credit ? '<figcaption>' + (caption ? md.utils.escapeHtml(caption) : '') + (credit ? '<span class="figure-credit">' + md.utils.escapeHtml(credit) + '</span>' : '') + '</figcaption>' : '';
      return '<figure class="notebook-figure">' + image + captionHtml + '</figure>';
    };
  });
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'node_modules/katex/dist/katex.min.css': 'assets/css/katex.css' });
  eleventyConfig.addPassthroughCopy({ 'node_modules/katex/dist/fonts': 'assets/css/fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
  eleventyConfig.addGlobalData('previewDrafts', process.env.ELEVENTY_ENV !== 'production');
  eleventyConfig.addGlobalData('currentTime', new Date().toISOString());
  eleventyConfig.addCollection('projects', (api) => api.getFilteredByGlob('src/projects/**/*.md')
    .filter((item) => !item.data.draft || process.env.ELEVENTY_ENV !== 'production')
    .sort((a, b) => Number(Boolean(b.data.featured)) - Number(Boolean(a.data.featured)) || a.data.title.localeCompare(b.data.title)));
  eleventyConfig.addCollection('archivedProjects', (api) => api.getFilteredByGlob('src/projects/**/*.md')
    .filter((item) => item.data.archived && (!item.data.draft || process.env.ELEVENTY_ENV !== 'production'))
    .sort((a, b) => a.data.title.localeCompare(b.data.title)));
  const visible = (item) => (!item.data.draft || process.env.ELEVENTY_ENV !== 'production') && !item.data.archived;
  const activeProjects = (api) => api.getFilteredByGlob('src/projects/**/*.md').filter(visible);
  eleventyConfig.addCollection('completedProjects', (api) => activeProjects(api).filter((item) => item.data.status === 'Completed'));
  eleventyConfig.addCollection('ongoingProjects', (api) => activeProjects(api).filter((item) => item.data.status !== 'Completed'));
  const dated = (a, b) => (b.data.date ? new Date(b.data.date).getTime() : 0) - (a.data.date ? new Date(a.data.date).getTime() : 0);
  const tagList = (value) => (Array.isArray(value) ? value : String(value || '').split(','))
    .map((tag) => String(tag).trim().toLowerCase())
    .filter(Boolean);
  const hasAnyTag = (item, names) => tagList(item.data.tags).some((tag) => names.includes(tag));
  eleventyConfig.addCollection('blogs', (api) => api.getFilteredByGlob('src/thoughts/blogs/**/*.md').filter(visible).sort(dated));
  eleventyConfig.addCollection('readingNotes', (api) => api.getFilteredByGlob('src/thoughts/reading/**/*.md').filter(visible).sort(dated));
  eleventyConfig.addCollection('workingOn', (api) => [
    ...api.getFilteredByGlob('src/projects/**/*.md'),
    ...api.getFilteredByGlob('src/thoughts/reading/**/*.md')
  ].filter(visible).filter((item) => hasAnyTag(item, ['working'])).sort(dated));
  eleventyConfig.addCollection('readingNow', (api) => api.getFilteredByGlob('src/thoughts/reading/**/*.md')
    .filter(visible)
    .filter((item) => hasAnyTag(item, ['currently-reading', 'hyperfixating']))
    .sort(dated));
  eleventyConfig.addCollection('notes', (api) => api.getFilteredByGlob('src/thoughts/notes/**/*.md')
    .filter((item) => item.data.type !== 'daily-note')
    .filter(visible).sort(dated));
  eleventyConfig.addCollection('dailyNotes', (api) => api.getFilteredByGlob('src/thoughts/notes/daily/**/*.md').filter(visible).sort(dated));
  eleventyConfig.addCollection('thoughts', (api) => [...api.getFilteredByGlob('src/thoughts/blogs/**/*.md'), ...api.getFilteredByGlob('src/thoughts/reading/**/*.md'), ...api.getFilteredByGlob('src/thoughts/notes/**/*.md')].filter(visible).sort(dated));
  eleventyConfig.addCollection('archivedThoughts', (api) => api.getFilteredByGlob('src/thoughts/{blogs,reading,notes}/**/*.md').filter((item) => item.data.archived && (!item.data.draft || process.env.ELEVENTY_ENV !== 'production')).sort(dated));
  eleventyConfig.addCollection('articles', (api) => api.getFilteredByGlob('src/thoughts/blogs/**/*.md').filter(visible).sort(dated));
  eleventyConfig.addFilter('limit', (items, count) => items.slice(0, count));
  eleventyConfig.addCollection('published', (api) => api.getAll().filter((item) =>
    item.outputPath && item.url && !item.data.draft && !item.data.excludeFromSitemap));
  eleventyConfig.addFilter('date', (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(value));
  });
  eleventyConfig.addFilter('xml', (value) => String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\"', '&quot;').replaceAll("'", '&apos;'));
  eleventyConfig.addFilter('isoDate', (value) => new Date(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter('jsonSafe', (value) => JSON.stringify(value).replaceAll('<', '\\u003c'));
  eleventyConfig.addTransform('prefix-assets', function (content) {
    if (this.outputPath && this.outputPath.endsWith('.html')) {
      return content
        .replace(/<p>(<figure class="notebook-figure">[\s\S]*?<\/figure>)<\/p>/g, '$1')
        .replace(/(src|href)="\/assets\//g, '$1="/Portfolio/assets/');
    }
    return content;
  });
  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['md', 'njk', '11ty.js', 'txt'],
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    pathPrefix: '/Portfolio/'
  };
};
