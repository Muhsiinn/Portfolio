const { entryData } = require('../../../scripts/content-defaults');

module.exports = entryData({
  type: 'note',
  permalink: (data) => '/thoughts/notes/' + data.page.fileSlug + '/'
});
