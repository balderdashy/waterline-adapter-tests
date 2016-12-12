/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports.payment = Waterline.Collection.extend({
  tableName: 'payment_manyTable',
  identity: 'payment_many',
  connection: 'associations',
  primaryKey: 'id',

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

    customer: {
      model: 'customer_many',
      columnName: 'customer_many_id',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    patron: {
      model: 'customer_many',
      columnName: 'customer_many_patron_id',
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

module.exports.customer = Waterline.Collection.extend({
  tableName: 'customer_manyTable',
  identity: 'customer_many',
  connection: 'associations',
  primaryKey: 'id',

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

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    payments: {
      collection: 'payment_many',
      via: 'customer'
    },

    transactions: {
      collection: 'payment_many',
      via: 'patron'
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
