/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'autoInc',
  tableName: 'autoIncTable',
  connection: 'autoIncConn',

  attributes: {
    name: 'string',
    aiField: {
      type: "integer",
      autoIncrement: true
    },
    normalField: 'integer',
    type: 'string'
  }

});
