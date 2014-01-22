var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.queryable = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('Modifiers', function() {
    describe('contains', function() {
      describe('shorthand', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return the user with the correct name', function(done) {
          var part = 'short_xx3ah4aj8xrxh!!!r',
              testName = 'short_xx3ah4aj8xrxh!!!r contains query test';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.contains({ first_name: part }, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].first_name === testName);
              done();
            });
          });
        });
      });

      describe('full where criteria', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return the user with the correct name', function(done) {
          var part = 'long_xx3ah4aj8xrxh!!!r',
              testName = 'long_xx3ah4aj8xrxh!!!r contains query test';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.where({ first_name: { contains: part }}, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].first_name === testName);
              done();
            });
          });
        });
      });

      describe('dynamic attribute', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should have [attribute]contains() method', function(done) {
          var part = 'xxx',
              testType = 'Dynamic Contains test' + part + 'test';

          User.create({ type: testType }, function(err) {
            if(err) return done(err);

            User.typeContains(part, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].type === testType);
              done();
            });
          });
        });
      });

    });
  });
});
