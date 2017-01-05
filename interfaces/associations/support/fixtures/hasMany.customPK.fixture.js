/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'apartmentTable',
  identity: 'apartment',
  connection: 'associations',
  primaryKey: 'number',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    number: {
      type: 'string',
      required: true,
      autoMigrations: {
        columnType: 'varchar',
        unique: true
      }
    },

    building: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    payments: {
      collection: 'Payment',
      via: 'apartment'
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
