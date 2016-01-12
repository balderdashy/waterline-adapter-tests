/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'driverWithSchemaTable',
  meta: {
    schemaName: 'foo'
  },
  identity: 'driverwithschema',
  connection: 'associations',

  // migrate: 'drop', 
  attributes: {
    name: 'string',
    taxis: {
      collection: 'taxiwithschema',
      via: 'drivers',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.name;
      return obj;
    }
  }
});
