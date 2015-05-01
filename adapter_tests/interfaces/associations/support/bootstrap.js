/**
 * Module Dependencies
 */

var Waterline = require('waterline');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var fixtures = {
  PaymentBelongsFixture: require('./fixtures/belongsTo.child.fixture'),
  CustomerBelongsFixture: require('./fixtures/belongsTo.parent.fixture'),
  PaymentHasManyFixture: require('./fixtures/hasMany.child.fixture'),
  CustomerHasManyFixture: require('./fixtures/hasMany.parent.fixture'),
  ApartmentHasManyFixture: require('./fixtures/hasMany.customPK.fixture'),
  PaymentManyFixture: require('./fixtures/multipleAssociations.fixture').payment,
  CustomerManyFixture: require('./fixtures/multipleAssociations.fixture').customer,
  StadiumFixture: require('./fixtures/hasManyThrough.stadium.fixture'),
  TeamFixture: require('./fixtures/hasManyThrough.team.fixture'),
  VenueFixture: require('./fixtures/hasManyThrough.venue.fixture'),
  TaxiFixture: require('./fixtures/manyToMany.taxi.fixture'),
  DriverFixture: require('./fixtures/manyToMany.driver.fixture'),
  UserOneFixture: require('./fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require('./fixtures/oneToOne.fixture').profile
};


/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var waterline, ontology;

before(function(done) {

  waterline = new Waterline();

  Object.keys(fixtures).forEach(function(key) {
    waterline.loadCollection(fixtures[key]);
  });

  var connections = { associations: _.clone(Connections.test) };

  waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return done(err);

    ontology = _ontology;

    Object.keys(_ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Associations[globalName] = _ontology.collections[key];
    });

    done();
  });
});

after(function(done) {

  function dropCollection(item, next) {
    if(!Adapter.hasOwnProperty('drop')) return next();

    ontology.collections[item].drop(function(err) {
      if(err) return next(err);
      next();
    });
  }

  async.each(Object.keys(ontology.collections), dropCollection, function(err) {
    if(err) return done(err);
    waterline.teardown(done);
  });

});
