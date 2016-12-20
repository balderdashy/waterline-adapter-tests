/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'paymentTable',
  identity: 'payment',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,

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

    amount: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    type: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    apartment: {
      model: 'apartment',
      columnName: 'apartment_id',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    a_customer: {
      model: 'Customer',
      columnName: 'customer_id',
      autoMigrations: {
        columnType: 'integer'
      }
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
