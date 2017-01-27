module.exports = {
  tableName: 'venueTable',
  identity: 'venue',
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

    seats: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    team: {
      model: 'team',
      columnName: 'team_id',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    stadium: {
      model: 'stadium',
      columnName: 'stadium_id',
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
