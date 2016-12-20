/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'paymentbelongsPKTable',
  identity: 'paymentbelongscustom',
  connection: 'associations',
  primaryKey: 'invoice',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,

  attributes: {
    invoice: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
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

    customer: {
      model: 'Customerbelongscustom',
      columnName: 'customer_belongs',
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
