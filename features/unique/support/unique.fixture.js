/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',
  primaryKey: 'id',

  attributes: {
    name: {
      type: 'string',
      autoMigrations: {
        columnType: 'varchar'          
      }      
    },
    email: {
      type: 'string',
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
    },
    id: {
      type: 'number',
      autoMigrations: {
        autoIncrement: true,
        columnType: 'integer'
      }
    }
  }

});
