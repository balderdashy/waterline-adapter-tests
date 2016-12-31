/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
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
      type: 'number',
      autoMigrations: {
        columnType: 'integer',
        autoIncrement: true,
        unique: true
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
