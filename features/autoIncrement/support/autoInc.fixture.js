/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = function() {
  return Waterline.Collection.extend({

    identity: 'autoInc',
    tableName: 'autoIncTable',
    datastore: 'autoIncConn',
    primaryKey: 'id',

    attributes: {
      name: {
        type: 'string',
        autoMigrations: {
          columnType: 'varchar'
        }
      },
      normalField: {
        type: 'number',
        autoMigrations: {
          columnType: '_number'
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
          columnType: '_numberkey'
        }
      }
    }

  });
};
