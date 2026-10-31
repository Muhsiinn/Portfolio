const { entryData, resolveDailyDate } = require('../../../../scripts/content-defaults');

module.exports = entryData({
  type: 'daily-note',
  layout: 'layouts/daily.njk',
  daily: true,
  permalink: (data) => '/thoughts/notes/daily/' + resolveDailyDate(data) + '/'
});
