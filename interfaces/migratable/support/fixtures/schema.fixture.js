/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'document',
  connection: 'migratable',

  attributes: {
    title: {
      type: 'string',
      primaryKey: true
    },

    number: {
      type: 'integer',
      autoIncrement: true
    },

    serialNumber: {
      type: 'string',
      unique: true
    }
  }

});
