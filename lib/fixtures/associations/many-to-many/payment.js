/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'paymentmany',
  adapter: 'test',

  attributes: {
    amount: 'integer',
    customers: {
      collection: 'CustomerMany'
    }
  }
});
