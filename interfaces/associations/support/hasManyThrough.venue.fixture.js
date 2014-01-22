/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'venue',
  connection: 'associations',

  attributes: {
    seats: 'integer',
    team: {
      model: 'team'
    },
    stadium: {
      model: 'stadium'
    }
  }

});
