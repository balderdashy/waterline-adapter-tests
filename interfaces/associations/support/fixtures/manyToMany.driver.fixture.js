/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'driver',
  connection: 'associations',

  // migrate: 'drop', 
  attributes: {
    name: 'string',
    taxis: {
      collection: 'taxi',
      via: 'drivers'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
});
