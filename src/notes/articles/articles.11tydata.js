module.exports = {
  type: 'article',
  isProject: false,
  eleventyComputed: {
    layout: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : 'layouts/entry.njk',
    permalink: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : '/articles/' + data.page.fileSlug + '/',
    pageTitle: (data) => data.title + ' — Muhsin\'s notebook'
  }
};
