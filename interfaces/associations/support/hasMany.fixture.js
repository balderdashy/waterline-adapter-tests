/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'customer',
  adapter: 'test',

  attributes: {
    name: 'string',
    payments: {
      collection: 'Payment'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }

});
