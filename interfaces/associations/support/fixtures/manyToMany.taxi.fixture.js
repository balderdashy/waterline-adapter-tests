module.exports = {
  tableName: 'taxiTable',
  identity: 'taxi',
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

    medallion: {
      columnName: 'mdln',
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    model: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    note: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    scorecards: {
      type: 'json',
      autoMigrations: {
        columnType: 'json'
      }
    },

    drivers: {
      collection: 'driver',
      via: 'taxis'
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
