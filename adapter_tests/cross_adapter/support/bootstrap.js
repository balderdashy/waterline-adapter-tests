/**
 * Module Dependencies
 */

var Waterline = require('waterline');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var crossAdapterFixturesPath = '../../cross_adapter/support/';

var fixtures = {
  PaymentBelongsFixture: require(crossAdapterFixturesPath + 'fixtures/belongsTo.child.fixture'),
  CustomerBelongsFixture: require('./fixtures/belongsTo.parent.fixture'),
  PaymentHasManyFixture: require('./fixtures/hasMany.child.fixture'),
  CustomerHasManyFixture: require(crossAdapterFixturesPath + 'fixtures/hasMany.parent.fixture'),
  ApartmentHasManyFixture: require(crossAdapterFixturesPath + 'fixtures/hasMany.customPK.fixture'),
  PaymentManyFixture: require(crossAdapterFixturesPath + 'fixtures/multipleAssociations.fixture').payment,
  CustomerManyFixture: require(crossAdapterFixturesPath + 'fixtures/multipleAssociations.fixture').customer,
  StadiumFixture: require(crossAdapterFixturesPath + 'fixtures/hasManyThrough.stadium.fixture'),
  TeamFixture: require(crossAdapterFixturesPath + 'fixtures/hasManyThrough.team.fixture'),
  VenueFixture: require(crossAdapterFixturesPath + 'fixtures/hasManyThrough.venue.fixture'),
  TaxiFixture: require('./fixtures/manyToMany.taxi.fixture'),
  DriverFixture: require(crossAdapterFixturesPath + 'fixtures/manyToMany.driver.fixture'),
  UserOneFixture: require(crossAdapterFixturesPath + 'fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require(crossAdapterFixturesPath + 'fixtures/oneToOne.fixture').profile
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

  var connections = { associations: _.clone(Connections.test), associations2: _.clone(Connections.test2) };

  // in case previous teardown failed
  Adapter.teardown('associations', function adapterTeardown(){

    waterline.initialize({ adapters: { wl_tests: Adapter, wl_tests2: MemoryAdapter }, connections: connections }, function(err, _ontology) {
      if(err) return done(err);

      ontology = _ontology;

      Object.keys(_ontology.collections).forEach(function(key) {
        var globalName = key.charAt(0).toUpperCase() + key.slice(1);
        global.Associations[globalName] = _ontology.collections[key];
      });

      done();
    });

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
