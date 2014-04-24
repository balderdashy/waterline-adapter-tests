/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'paymentbelongs',
  connection: 'associations',

  attributes: {
    amount: 'integer',
    type: 'string',
    customer: {
      model: 'Customerbelongs'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.type;
      return obj;
    }
  }

});
