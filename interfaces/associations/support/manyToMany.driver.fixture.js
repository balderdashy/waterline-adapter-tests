/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'driver',
  adapter: 'test',

  attributes: {
    name: 'string',
    taxis: {
      collection: 'taxi'
    }
  }
});
