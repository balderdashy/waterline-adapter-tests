module.exports = {
  tableName: 'paymentTable',
  identity: 'payment',
  datastore: 'associations',
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
        columnType: Adapter.identity === 'sails-mongo' ? '_stringkey' : '_numberkey',
        autoIncrement: Adapter.identity === 'sails-mongo' ? false : true,
        unique: true
      }
    },

    amount: {
      type: 'number',
      columnName: 'amt',
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

    note: {
      type: 'string',
      columnName: 'memo',
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
};
