module.exports = {
  type: 'daily-note',
  eleventyComputed: {
    layout: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : 'layouts/daily.njk',
    permalink: (data) => data.draft && process.env.ELEVENTY_ENV === 'production' ? false : data.legacyPermalink || '/thoughts/notes/daily/' + (data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date).slice(0, 10)) + '/',
    pageTitle: (data) => data.title + ' — Muhsin\'s notebook'
  }
};
