/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'taxi',
  adapter: 'test',

  attributes: {
    medallion: 'integer',
    drivers: {
      collection: 'driver'
    }
  }
});
