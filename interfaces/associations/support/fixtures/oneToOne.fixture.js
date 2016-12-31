/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports.user_resource = Waterline.Collection.extend({
  tableName: 'user_resourceTable',
  identity: 'user_resource',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    // Primary Key
    id: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
        autoIncrement: true,
        unique: true
      }
    },

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    quantity: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    profile: {
      model: 'profile',
      columnName: 'profile_id',
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

});

module.exports.profile = Waterline.Collection.extend({
  tableName: 'profileTable',
  identity: 'profile',
  connection: 'associations',
  primaryKey: 'id',
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,

  attributes: {
    // Primary Key
    id: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
        autoIncrement: true,
        unique: true
      }
    },

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },

    level: {
      type: 'number',
      autoMigrations: {
        columnType: 'integer'
      }
    },

    user: {
      model: 'user_resource',
      columnName: 'user_resource_id',
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
});
