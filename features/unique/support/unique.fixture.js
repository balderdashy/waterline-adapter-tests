/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',
  primaryKey: 'id',
  archiveModelIdentity: false,

  attributes: {
    // Primary Key
    id: {
      type: Adapter.identity === 'sails-mongo' ? 'string' : 'number',
      columnName: '_id',
      autoMigrations: {
        columnType: Adapter.identity === 'sails-mongo' ? '_stringkey' : '_numberkey',
        autoIncrement: Adapter.identity === 'sails-mongo' ? false : true,
        unique: true,
      }
    },

    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    },
    email: {
      type: 'string',
      required: true,
      autoMigrations: {
        unique: true,
        columnType: 'varchar'
      }
    },
    type: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'
      }
    }
  }
});
