const { entryData } = require('../../../scripts/content-defaults');

module.exports = entryData({
  type: 'reading-note',
  permalink: (data) => '/thoughts/reading/' + data.page.fileSlug + '/'
});
