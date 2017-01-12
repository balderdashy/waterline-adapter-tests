/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'taxiTable',
  identity: 'taxi',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    // Primary Key
    id: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
        autoIncrement: true,
        unique: true
      }
    },

    medallion: {
      columnName: 'mdln',
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    model: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    note: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    drivers: {
      collection: 'driver',
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
