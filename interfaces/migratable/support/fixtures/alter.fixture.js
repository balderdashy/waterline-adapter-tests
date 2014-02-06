/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'alter',
  connection: 'migratable',
  migrate: 'alter',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
