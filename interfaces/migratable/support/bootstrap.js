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
  AlterFixture: require('./fixtures/alter.fixture'),
  CreateFixture: require('./fixtures/create.fixture'),
  CustomFixture: require('./fixtures/custom.fixture'),
  DropFixture: require('./fixtures/drop.fixture'),
  SafeFixture: require('./fixtures/safe.fixture')
};


var waterline;
var ORM;

// Model defaults
var defaults = {
  fetchRecordsOnUpdate: true,
  fetchRecordsOnDestroy: false,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,
  archiveModelIdentity: false,
  attributes: {
    id: {
      type: Adapter.identity === 'sails-mongo' ? 'string' : 'number',
      columnName: '_id',
      autoMigrations: {
        columnType: 'integer',
        autoIncrement: Adapter.identity === 'sails-mongo' ? false : true,
        unique: true
      }
    }
  }
};


//  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ┌┐ ┌─┐┌─┐┌─┐┬─┐┌─┐
//  ║ ╦║  ║ ║╠╩╗╠═╣║    ├┴┐├┤ ├┤ │ │├┬┘├┤
//  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  └─┘└─┘└  └─┘┴└─└─┘
before(function(done) {
  waterline = new Waterline();

  // Store the fixtures so they can be accessed globally
  global.Migratable.fixtures = _.cloneDeep(fixtures);

  _.each(fixtures, function(val, key) {
    var modelFixture = _.merge({}, defaults, fixtures[key]);
    waterline.registerModel(Waterline.Collection.extend(modelFixture));
  });

  var datastores = {
    migratable: _.clone(Connections.test)
  };

  // Store access to the instantiated Waterline instance so tests can
  // call teardown.
  global.Migratable.Waterline = waterline;

  // Store access to the options passed in to initialize so tests can re-initialize
  // Waterline.
  var wlOptions = {
    adapters: {
      wl_tests: Adapter
    },
    datastores: datastores,
    defaults: defaults
  };

  global.Migratable.WaterlineOptions = wlOptions;

  waterline.initialize(wlOptions, function(err, orm) {
    if (err) {
      return done(err);
    }

    // Save a reference to the ORM
    ORM = orm;

    // Globalize collections for normalization
    _.each(ORM.collections, function(collection, identity) {
      var globalName = identity.charAt(0).toUpperCase() + identity.slice(1);
      global.Migratable[globalName] = collection;
    });

    // Run migrations
    waterlineUtils.autoMigrations('alter', orm, function(err) {
      if (err) {
        return done(err);
      }

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
    var datastoreName = collection.datastore;
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
