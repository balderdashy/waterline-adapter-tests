/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'apartmentTable',
  identity: 'apartment',
  connection: 'associations',
  autoPK: false,

  attributes: {
    building: 'string',
    number: {
      type: 'string',
      primaryKey: true,
      unique: true
    },
    payments: {
      collection: 'Payment',
      via: 'apartment'
    }
  }

});
