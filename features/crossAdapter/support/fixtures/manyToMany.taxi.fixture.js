/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'taxiTable',
  identity: 'taxi',
  connection: 'associations2',

  // migrate: 'drop',
  attributes: {
    medallion: 'number',
    model: 'string',
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
