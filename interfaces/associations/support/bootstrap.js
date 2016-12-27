/**
 * Module Dependencies
 */

var assert = require('assert');
var _ = require('@sailshq/lodash');
var async = require('async');
var Waterline = require('waterline');
var waterlineUtils = require('waterline-utils');

// Require Fixtures
var fixtures = {
  PaymentBelongsFixture: require('./fixtures/belongsTo.child.fixture'),
  PaymentBelongsCustomFixture: require('./fixtures/belongsTo.child.customPK.fixture'),
  CustomerBelongsFixture: require('./fixtures/belongsTo.parent.fixture'),
  CustomerBelongsCustomFixture: require('./fixtures/belongsTo.parent.customPK.fixture'),
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
  TaxiWithSchemaFixture: require('./fixtures/manyToMany.taxi.withSchema.fixture'),
  DriverWithSchemaFixture: require('./fixtures/manyToMany.driver.withSchema.fixture'),
  TaxiCustomFixture: require('./fixtures/manyToMany.taxi.customPK.fixture'),
  DriverCustomFixture: require('./fixtures/manyToMany.driver.customPK.fixture'),
  UserOneFixture: require('./fixtures/oneToOne.fixture').user_resource,
  ProfileOneFixture: require('./fixtures/oneToOne.fixture').profile
};


var waterline;
var ORM;


//  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ┌┐ ┌─┐┌─┐┌─┐┬─┐┌─┐
//  ║ ╦║  ║ ║╠╩╗╠═╣║    ├┴┐├┤ ├┤ │ │├┬┘├┤ 
//  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  └─┘└─┘└  └─┘┴└─└─┘
before(function(done) {
  waterline = new Waterline();

  _.each(fixtures, function(val, key) {
    waterline.registerModel(fixtures[key]);
  });

  var datastores = { 
    associations: _.clone(Connections.test) 
  };

  var defaults = { 
    migrate: 'alter' 
  };

  waterline.initialize({ adapters: { wl_tests: Adapter }, datastores: datastores, defaults: defaults }, function(err, orm) {
    if (err) {
      return done(err);
    }

    // Save a reference to the ORM
    ORM = orm;

    // Run migrations
    waterlineUtils.autoMigrations('alter', orm, function(err) {
      if (err) {
        return done(err);
      }

      // Globalize collections for normalization
      _.each(ORM.collections, function(collection, identity) {
        var globalName = identity.charAt(0).toUpperCase() + identity.slice(1);
        global.Associations[globalName] = collection;
      });

      return done();
    });
  });
});


//  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ┌─┐┌─┐┌┬┐┌─┐┬─┐
//  ║ ╦║  ║ ║╠╩╗╠═╣║    ├─┤├┤  │ ├┤ ├┬┘
//  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  ┴ ┴└   ┴ └─┘┴└─
after(function(done) {
  function dropCollection(item, next) {
    if (!_.has(Adapter, 'drop')) {
      return next();
    }

    // Grab the adapter to perform the query on
    var collection = ORM.collections[item];
    var datastoreName = collection.adapterDictionary.drop;
    var tableName = collection.tableName || collection.identity;
    Adapter.drop(datastoreName, tableName, [], next);
  }

  async.each(_.keys(ORM.collections), dropCollection, function(err) {
    if (err) {
      return done(err);
    }

    waterline.teardown(done);
  });
});
