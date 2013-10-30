/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'taxi',
  adapter: 'test',

  attributes: {
    medallion: 'integer',
    drivers: {
      collection: 'driver'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.medallion;
      return obj;
    }
  }
});
