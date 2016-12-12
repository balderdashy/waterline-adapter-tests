/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'userTable2',
  identity: 'user',
  datastore: 'queryable',
  primaryKey: 'id',

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

});
