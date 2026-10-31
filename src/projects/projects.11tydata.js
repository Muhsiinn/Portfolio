const { entryData } = require('../../scripts/content-defaults');

module.exports = {
  isProject: true,
  ...entryData({
    type: 'project',
    permalink: (data) => '/projects/' + data.page.fileSlug + '/'
  })
};
