module.exports = {
  tableName: 'taxiTableCustomPK',
  identity: 'taxicustom',
  connection: 'associations',
  primaryKey: 'vin',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,
  
  attributes: {
    vin: {
      type: 'string',
      required: true,
      autoMigrations: {
        columnType: 'varchar',
        unique: true
      }
    },

    medallion: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    drivers: {
      collection: 'drivercustom',
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
