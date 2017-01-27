module.exports = {
  tableName: 'customerbelongsPKTable',
  identity: 'customerbelongscustom',
  connection: 'associations',
  primaryKey: 'username',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    username: {
      type: 'string',
      required: true,
      autoMigrations: {
        columnType: 'varchar',
        unique: true
      }
    },

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    title: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    payments: {
      collection: 'Paymentbelongscustom',
      via: 'customer'
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
