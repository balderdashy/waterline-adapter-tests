module.exports = {
  identity: 'user',
  tableName: 'userTable',
  datastore: 'semantic',
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
        unique: true,//<< FUTURE: Remove this (unnecessary since this is the PK attribute)
      }
    },

    first_name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    last_name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    type: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    age: {
      type: 'number',
      allowNull: true,
      autoMigrations: {
        columnType: 'integer'
      }
    },

    obj: {
      type: 'json',
      autoMigrations: {
        columnType: 'json'
      }
    },

    status: {
      type: 'boolean',
      autoMigrations: {
        columnType: 'boolean'
      }
    },

    avatar: {
      type: 'ref',
      autoMigrations: {
        columnType: 'text'
      }
    },

    sort: {
      type: 'json',
      autoMigrations: {
        columnType: 'json'
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
