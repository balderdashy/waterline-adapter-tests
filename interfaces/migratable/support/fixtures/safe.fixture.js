/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'safe',
  connection: 'migratable',
  migrate: 'safe',

  attributes: {
    name: 'string',
    age: 'integer'
  }

});
