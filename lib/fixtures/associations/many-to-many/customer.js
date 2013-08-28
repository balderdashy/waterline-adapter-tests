/**
 * Dependencies
 */

var Waterline = require('waterline');


module.exports = Waterline.Collection.extend({
  identity: 'customermany',
  adapter: 'test',

  attributes: {
    name: 'string',
    payments: {
      collection: 'PaymentMany'
    }
  }
});
