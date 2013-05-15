/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Model.extend({

  identity: 'user',
  adapter: 'test',

  attributes: {
    first_name: 'string',
    last_name: 'string',
    email: 'string',
    title: 'string',
    phone: 'string',
    type: 'string',
    favoriteFruit: {
      defaultsTo: 'blueberry',
      type: 'string'
    },
    age: 'integer',
    status: {
      type: 'boolean',
      defaultsTo: 0
    },
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    }
  }

});