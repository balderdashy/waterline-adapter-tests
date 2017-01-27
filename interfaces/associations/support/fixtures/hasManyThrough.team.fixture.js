module.exports = {
  tableName: 'teamTable',
  identity: 'team',
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
      columnName: 'handle',
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    mascot: {
      columnName: 'icon',
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    wins: {
      columnName: 'Ws',
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    stadiums: {
      collection: 'Stadium',
      through: 'venue',
      via: 'team'
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
