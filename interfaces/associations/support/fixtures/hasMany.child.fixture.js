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
      model: 'apartment'
    },
    customer: {
      model: 'Customer'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});
