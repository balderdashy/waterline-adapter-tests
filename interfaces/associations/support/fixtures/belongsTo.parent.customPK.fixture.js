/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'customerbelongsPKTable',
  identity: 'customerbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    username: {
      type: 'string',
      primaryKey: true
    },
    name: 'string',
    title: 'string',
    payments: {
      collection: 'Paymentbelongscustom',
      via: 'customer'
    }
  }

});
