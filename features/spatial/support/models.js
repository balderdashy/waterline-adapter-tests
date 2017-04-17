var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'geomodel',
  tableName: 'geomodelTable',
  connection: 'geoConnection',

  attributes: {
    name: 'string',
    prop1: 'string',
    marker: {
      type: 'json',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POINT'
      }
    },
    line: {
      type: 'json',
      geometry: {
        nativeSrid: 4326,
        wktType: 'LINESTRING'
      }
    },
    shape: {
      type: 'json',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POLYGON'
      }
    },
    genericGeometry: {
      type: 'json',
      geometry: {
        nativeSrid: 4326,
        wktType: 'GEOMETRY'
      }
    }
  }
});


