const { entryData } = require('../../../scripts/content-defaults');

module.exports = entryData({
  type: 'blog',
  permalink: (data) => '/thoughts/blogs/' + data.page.fileSlug + '/'
});
