/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'loadtest',
  tableName: 'loadTestTable',
  adapter: 'test',

  attributes: {
    first_name: 'string',
    last_name: 'string',
    email: {
      type: 'string',
      columnName: 'emailAddress'
    }, 
    title: 'string',
    phone: 'string',
    type: 'string',
    favoriteFruit: {
      defaultsTo: 'blueberry',
      type: 'string'
    },
    age: 'integer', // integer field that's not auto-incrementable
    dob: 'datetime',
    status: {
      type: 'boolean',
      defaultsTo: false
    },
    percent: 'float',
    list: 'array',
    obj: 'json',
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    }
  }

});
