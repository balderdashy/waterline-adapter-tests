/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'driverTableCustomPK',
  identity: 'drivercustom',
  connection: 'associations',
  primaryKey: 'number',

  attributes: {
    number: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
        unique: true
      }
    },

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    taxis: {
      collection: 'taxicustom',
      via: 'drivers',
      dominant: true
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
