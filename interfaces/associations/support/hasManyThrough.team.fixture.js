/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'team',
  connection: 'associations',

  attributes: {
    name: 'string',
    mascot: 'string',
    stadiums: {
      collection: 'Stadium',
      through: 'venue'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.mascot;
      return obj;
    }
  }

});
