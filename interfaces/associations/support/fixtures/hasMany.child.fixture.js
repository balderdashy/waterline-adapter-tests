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
    type: {
      type: 'string',
      columnName: 'payment_type'
    },
    apartment: {
      model: 'apartment',
      columnName: 'apartment_id'
    },
    a_customer: {
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
