/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'pkfactory',
  adapter: 'test',
  autoPk: false,

  attributes: {
    title: {
      type: 'string',
      primaryKey: true,
      columnName: 'pkColumn'
    },

    number: {
      type: 'integer'
    }
  }

});
