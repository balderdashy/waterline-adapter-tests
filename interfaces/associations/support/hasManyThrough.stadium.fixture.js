/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'stadium',
  adapter: 'test',

  attributes: {
    name: 'string',
    teams: {
      collection: 'Team',
      through: 'venue'
    }
  }

});
