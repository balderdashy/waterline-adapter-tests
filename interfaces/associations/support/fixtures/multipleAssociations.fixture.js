module.exports.payment = {
  tableName: 'payment_manyTable',
  identity: 'payment_many',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    // Primary Key
    id: {
      type: Adapter.identity === 'sails-mongo' ? 'string' : 'number',
      columnName: '_id',
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
};

module.exports.customer = {
  tableName: 'customer_manyTable',
  identity: 'customer_many',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    // Primary Key
    id: {
      type: Adapter.identity === 'sails-mongo' ? 'string' : 'number',
      columnName: '_id',
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
};
