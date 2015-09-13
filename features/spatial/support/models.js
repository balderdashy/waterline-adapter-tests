var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'geomodel',
  tableName: 'geomodelTable',
  connection: 'geoConnection',

  attributes: {
    name: 'string',
    prop1: 'string',
    marker: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POINT'
      }
    },
    line: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'LINESTRING'
      }
    },
    shape: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POLYGON'
      }
    },
    genericGeometry: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'GEOMETRY'
      }
    }
  }
});


