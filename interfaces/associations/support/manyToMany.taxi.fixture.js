/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'taxi',
  adapter: 'test',

  attributes: {
    name: 'string',
    drivers: {
      collection: 'driver'
    }
  }
});
