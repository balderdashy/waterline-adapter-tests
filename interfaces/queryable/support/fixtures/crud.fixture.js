module.exports = {
  identity: 'userforqueryableinterface',
  tableName: 'userTable2',
  datastore: 'queryable',
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

    first_name: {
      type: 'string',
      columnName: 'fName',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    last_name: {
      type: 'string',
      columnName: 'lName',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    type: {
      type: 'string',
      columnName: 't',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    age: {
      type: 'number',
      columnName: 'a',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    email: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
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
