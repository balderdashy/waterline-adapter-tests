/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'customer',
  adapter: 'test',

  attributes: {
    payments: {
      collection: 'Payment'
    }
  }

});
