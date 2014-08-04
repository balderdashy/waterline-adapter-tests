/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  // tableName: 'customTable',
  identity: 'custom',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: {
    	type: 'string',
    	columnName: 'nameColumn'
    },
    age: 'integer'
  }

});
