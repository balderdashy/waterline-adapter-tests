/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'customerbelongs',
  tableName: 'customerbelongsTable',
  connection: 'associations2',

  attributes: {
    name: 'string',
    title: 'string',
    payments: {
      collection: 'Paymentbelongs',
      via: 'customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
