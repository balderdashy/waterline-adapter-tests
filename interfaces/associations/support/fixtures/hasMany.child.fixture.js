/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'paymentTable',
  identity: 'payment',
  connection: 'associations',

  attributes: {
    amount: 'integer',
    type: 'string',
    apartment: {
      model: 'apartment',
      columnName: 'apartment_id'
    },
    customer: {
      model: 'Customer',
      columnName: 'customer_id'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});
