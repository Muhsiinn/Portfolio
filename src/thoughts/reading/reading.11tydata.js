module.exports = {
  type: 'reading-note',
  eleventyComputed: {
    layout: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : 'layouts/entry.njk',
    permalink: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : data.legacyPermalink || '/thoughts/reading/' + data.page.fileSlug + '/',
    pageTitle: (data) => data.title + ' — Muhsin\'s notebook'
  }
};
