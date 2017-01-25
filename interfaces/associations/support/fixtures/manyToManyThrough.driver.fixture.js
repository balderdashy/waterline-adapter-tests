/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'driverThroughTable',
  identity: 'driverThrough',
  connection: 'associations',

  // migrate: 'drop', 
  attributes: {
    name: 'string',
    taxis: {
      collection: 'taxiThrough',
      via: 'taxidriver',
      through: 'rideshare'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
});
