/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'rideshareTable',
  identity: 'rideshare',
  connection: 'associations',

  attributes: {
    tips: 'boolean',
    taxidriver: {
      model: 'driverThrough',
      columnName: 'driver_id'
    },
    drivertaxi: {
      model: 'taxiThrough',
      columnName: 'taxi_id'
    }
  }

});
