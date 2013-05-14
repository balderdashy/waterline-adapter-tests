/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Model.extend({

  identity: 'user',
  adapter: 'test',

  attributes: {
    name  : 'string',
    email : 'string',
    title : 'string',
    phone : 'string',
    type  : 'string',
    favoriteFruit : {
      defaultsTo: 'blueberry',
      type: 'string'
    },
    age   : 'integer',
    status: {
      type: 'boolean',
      defaultsTo: 0
    }
  }

});