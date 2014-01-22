/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports.payment = Waterline.Collection.extend({

  identity: 'payment_many',
  connection: 'associations',

  attributes: {
    amount: 'integer',
    type: 'string',
    customer: {
      model: 'customer_many'
    },
    patron: {
      model: 'customer_many'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});

module.exports.customer = Waterline.Collection.extend({

  identity: 'customer_many',
  connection: 'associations',

  attributes: {
    name: 'string',
    payments: {
      collection: 'payment_many',
      via: 'customer'
    },
    transactions: {
      collection: 'payment_many',
      via: 'patron'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
