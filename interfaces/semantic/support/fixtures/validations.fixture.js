/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'thing',
  tableName: 'thingTable',
  connection: 'semantic',

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    age: {
      type: 'integer',
      required: true,
      min: 5,
      max: 20
    },
    description: 'string'
  }

});
