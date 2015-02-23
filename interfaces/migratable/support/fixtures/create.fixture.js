/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'create',
  connection: 'migratable',
  migrate: 'create',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
