/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = {
  tableName: 'safe',
  connection: 'migratable',
  migrate: 'safe',
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
    
    name: {
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
