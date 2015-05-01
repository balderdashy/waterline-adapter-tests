/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'drop',
  connection: 'migratable',
  migrate: 'drop',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
