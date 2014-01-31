/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports.user_resource = Waterline.Collection.extend({

  identity: 'user_resource',
  connection: 'associations',

  attributes: {
    name: 'string',
    profile: {
      model: 'profile'
    }
  }

});

module.exports.profile = Waterline.Collection.extend({

  identity: 'profile',
  connection: 'associations',

  attributes: {
    name: 'string',
    user: {
      model: 'user_resource'
    }
  }

});
