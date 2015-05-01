/**
 * Module Dependencies
 */

var Waterline = require('waterline');
var _ = require('lodash');
var async = require('async');
var assert = require('assert');

// Require Fixtures
var fixtures = {
  UserFixture: require('./fixtures/crud.fixture')
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

  var connections = { queryable: _.clone(Connections.test) };

  waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections }, function(err, _ontology) {
    if(err) return done(err);

    ontology = _ontology;

    Object.keys(_ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Queryable[globalName] = _ontology.collections[key];
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
