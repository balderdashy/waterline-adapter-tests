module.exports = {
  tableName: 'customerTable',
  identity: 'customer',
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

    name: {
      columnName: 'n',
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

    capital: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    payments: {
      collection: 'Payment',
      via: 'a_customer'
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
