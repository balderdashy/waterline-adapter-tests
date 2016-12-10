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

    // obj: {
    //   type: 'json',
    //   autoMigrations: {
    //     columnType: 'json'
    //   }
    // },

    // status: {
    //   type: 'boolean',
    //   autoMigrations: {
    //     columnType: 'boolean'
    //   }
    // },

    // avatar: {
    //   type: 'ref',
    //   autoMigrations: {
    //     columnType: 'binary'
    //   }
    // },

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

    // first_name: 'string',
    // last_name: 'string',
    // email: 'string',
    // title: 'string',
    // phone: 'string',
    // type: 'string',
    // favoriteFruit: {
    //   defaultsTo: 'blueberry',
    //   type: 'string'
    // },
    // age: 'integer', // integer field that's not auto-incrementable
    // dob: 'date',
    // status: {
    //   type: 'boolean',
    //   defaultsTo: false
    // },
    // percent: 'float',
    // list: 'array',
    // obj: 'json',
  }

});
