/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'taxiThroughTable',
  identity: 'taxiThrough',
  connection: 'associations',

  // migrate: 'drop', 
  attributes: {
    medallion: 'integer',
    drivers: {
      collection: 'driverThrough',
      via: 'drivertaxi',
      through: 'rideshare'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.medallion;
      return obj;
    }
  }
});
