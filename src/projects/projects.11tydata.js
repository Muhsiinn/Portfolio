module.exports = {
  isProject: true,
  eleventyComputed: {
    layout: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : 'layouts/entry.njk',
    permalink: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : '/projects/' + data.page.fileSlug + '/',
    pageTitle: (data) => data.title + ' — Muhsin\'s notebook'
  }
};
