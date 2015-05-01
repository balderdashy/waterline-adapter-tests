/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'taxiTable',
  identity: 'taxi',
  connection: 'associations',

  // migrate: 'drop', 
  attributes: {
    medallion: 'integer',
    drivers: {
      collection: 'driver',
      via: 'taxis'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.medallion;
      return obj;
    }
  }
});
