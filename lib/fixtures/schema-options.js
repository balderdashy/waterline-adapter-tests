/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'document',
  adapter: 'test',

  attributes: {
    title: {
      type: 'string',
      primaryKey: true
    },

    number: {
      autoIncrement: true
    },

    serialNumber: {
      type: 'string',
      unique: true
    }
  }

});
