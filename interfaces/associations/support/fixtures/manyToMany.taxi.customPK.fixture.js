/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'taxiTableCustomPK',
  identity: 'taxicustom',
  connection: 'associations',
  primaryKey: 'vin',

  attributes: {
    vin: {
      type: 'string',
      primaryKey: true
    },

    medallion: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    drivers: {
      collection: 'drivercustom',
      via: 'taxis'
    },

    // Timestamps

    updatedAt: {
      type: 'number',
      autoUpdatedAt: true,
      autoMigrations: {
        columnType: 'bigint'
      }
    },

    createdAt: {
      type: 'number',
      autoCreatedAt: true,
      autoMigrations: {
        columnType: 'bigint'
      }
    }
  }
});
