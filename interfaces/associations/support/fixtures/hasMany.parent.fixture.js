/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'customerTable',
  identity: 'customer',
  connection: 'associations',

  attributes: {
    name: 'string',
    title: 'string',
    payments: {
      collection: 'Payment',
      via: 'customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
