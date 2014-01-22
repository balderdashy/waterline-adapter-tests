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

  describe('IN Query Modifier', function() {

    describe('with a record', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = 'IN_query_test';

      before(function(done) {
        var users = [{ first_name: testName }, { first_name: 'something else' }];

        User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return correct user', function(done) {
        User.find({ first_name: ["foo", testName, "bar", "baz"] }, function(err, users) {
          assert(!err);
          assert(users.length === 1);
          assert(users[0].first_name === testName);
          done();
        });
      });

      it('should return a model instance', function(done) {
        User.find({ first_name: ["foo", testName, "bar", "baz"] }, function(err, users) {
          assert(users[0].id);
          assert(typeof users[0].fullName === 'function');
          assert(toString.call(users[0].createdAt) == '[object Date]');
          assert(toString.call(users[0].updatedAt) == '[object Date]');
          done();
        });
      });
    });

    describe('without a record', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return an empty array', function(done) {
        User.find({ first_name: ["foo", "bar", "baz"] }, function(err, users) {
          assert(users.length === 0);
          done();
        });
      });
    });

  });
});
