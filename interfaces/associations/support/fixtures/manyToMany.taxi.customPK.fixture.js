/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'taxiTableCustomPK',
  identity: 'taxicustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    vin: {
      type: 'string',
      primaryKey: true
    },
    medallion: 'integer',
    drivers: {
      collection: 'drivercustom',
      via: 'taxis'
    }
  }
});
