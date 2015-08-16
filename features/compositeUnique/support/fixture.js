var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'compositeUnique',
  tableName: 'compositeUniqueTable',
  connection: 'compositeUniqueConnection',

  attributes: {
    name: 'string',
    uniqueOne: {
      type: 'string',
      unique: {
        unique: false,
        composite: [ 'uniqueTwo' ]
      }
    },

    uniqueTwo: {
      type: 'string',
      unique: {
        unique: false,
        composite: [ 'uniqueOne' ]
      }
    }
  }

});

