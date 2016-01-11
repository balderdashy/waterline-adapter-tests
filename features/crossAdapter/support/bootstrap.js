/**
 * Module Dependencies
 */

var Waterline = require('waterline');
var _ = require('lodash');
var async = require('async');

// Require Fixtures
var associationsFixturesPath = '../../../interfaces/associations/support/';

var fixtures = {
  PaymentBelongsFixture: require(associationsFixturesPath + 'fixtures/belongsTo.child.fixture'),
  PaymentBelongsCustomFixture: require(associationsFixturesPath + 'fixtures/belongsTo.child.customPK.fixture'),
  CustomerBelongsFixture: require('./fixtures/belongsTo.parent.fixture'),
  CustomerBelongsCustomFixture: require(associationsFixturesPath + 'fixtures/belongsTo.parent.customPK.fixture'),
  PaymentHasManyFixture: require('./fixtures/hasMany.child.fixture'),
  CustomerHasManyFixture: require(associationsFixturesPath + 'fixtures/hasMany.parent.fixture'),
  ApartmentHasManyFixture: require(associationsFixturesPath + 'fixtures/hasMany.customPK.fixture'),
  PaymentManyFixture: require(associationsFixturesPath + 'fixtures/multipleAssociations.fixture').payment,
  CustomerManyFixture: require(associationsFixturesPath + 'fixtures/multipleAssociations.fixture').customer,
  StadiumFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.stadium.fixture'),
  TeamFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.team.fixture'),
  VenueFixture: require(associationsFixturesPath + 'fixtures/hasManyThrough.venue.fixture'),
  TaxiFixture: require('./fixtures/manyToMany.taxi.fixture'),
  DriverFixture: require(associationsFixturesPath + 'fixtures/manyToMany.driver.fixture'),
  TaxiWithSchemaFixture: require(associationsFixturesPath + './fixtures/manyToMany.taxi.withSchema.fixture'),
  DriverWithSchemaFixture: require(associationsFixturesPath + './fixtures/manyToMany.driver.withSchema.fixture'),
  TaxiCustomFixture: require(associationsFixturesPath + 'fixtures/manyToMany.taxi.customPK.fixture'),
  DriverCustomFixture: require(associationsFixturesPath + 'fixtures/manyToMany.driver.customPK.fixture'),
  UserOneFixture: require(associationsFixturesPath + 'fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require(associationsFixturesPath + 'fixtures/oneToOne.fixture').profile
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
