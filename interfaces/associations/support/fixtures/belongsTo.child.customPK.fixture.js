/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  tableName: 'paymentbelongsPKTable',
  identity: 'paymentbelongscustom',
  connection: 'associations',

  autoPK: false,

  attributes: {
    invoice: {
      type: 'integer',
      primaryKey: true
    },
    amount: 'integer',
    type: 'string',
    customer: {
      model: 'Customerbelongscustom',
      columnName: 'customer_belongs'
    }
  }

});
