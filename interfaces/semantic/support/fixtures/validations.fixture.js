module.exports = {
  identity: 'thing',
  tableName: 'thingTable',
  datastore: 'semantic',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: true,
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
      type: 'string',
      required: true,
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    age: {
      type: 'number',
      required: true,
      validations: {
        min: 5,
        max: 20,
      },
      autoMigrations: {
        columnType: 'integer'
      }
    },

    description: {
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
