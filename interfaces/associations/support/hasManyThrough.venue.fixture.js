/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'venue',
  adapter: 'test',

  attributes: {
    seats: 'integer',
    team: {
      model: 'team',
      type: 'string'
    },
    stadium: {
      model: 'stadium',
      type: 'string'
    }
  }

});
