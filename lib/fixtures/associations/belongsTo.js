/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'payment',
  adapter: 'test',

  attributes: {
    amount: 'integer',
    customer: {
      model: 'Customer'
    }
  }

});
