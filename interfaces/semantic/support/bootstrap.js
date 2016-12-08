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
  UserFixture: require('./fixtures/crud.fixture'),
  ThingFixture: require('./fixtures/validations.fixture')
};


var waterline;
var ORM;


//  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ┌┐ ┌─┐┌─┐┌─┐┬─┐┌─┐
//  ║ ╦║  ║ ║╠╩╗╠═╣║    ├┴┐├┤ ├┤ │ │├┬┘├┤ 
//  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  └─┘└─┘└  └─┘┴└─└─┘
before(function(done) {
  waterline = new Waterline();

  _.each(fixtures, function(val, key) {
    waterline.loadCollection(fixtures[key]);
  });

  var connections = { 
    semantic: _.clone(Connections.test) 
  };

  var defaults = { 
    migrate: 'alter' 
  };

  waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, orm) {
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
        global.Semantic[globalName] = collection;
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
