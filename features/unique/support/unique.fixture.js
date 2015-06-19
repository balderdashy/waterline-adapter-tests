/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'unique',
  tableName: 'uniqueTable',
  connection: 'uniqueConn',

  attributes: {
    name: 'string',
    email: {
      type: 'string',
      unique: true
    },
    type: 'string'
  }

});
