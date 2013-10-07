/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'team',
  adapter: 'test',

  attributes: {
    name: 'string',
    stadiums: {
      collection: 'Stadium',
      through: 'venue'
    }
  }

});
