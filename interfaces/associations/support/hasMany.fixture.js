/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'customer',
  adapter: 'test',

  attributes: {
    name: 'string',
    payments: {
      collection: 'Payment'
    }
  }

});
