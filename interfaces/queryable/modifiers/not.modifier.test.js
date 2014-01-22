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

    describe('not (!)', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = 'not ! test';

      before(function(done) {
        var users = [];

        for(var i=40; i<44; i++) {
          users.push({ first_name: testName, age: i });
        }

        User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return records with string usage', function(done) {
        User.find({ first_name: testName, age: { not: 40 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);

          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // TODO: check that models without the attribute in question set AT ALL,
          //        should still be returned, since their "age" is not equal to 40 (they are ageless)
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          done();
        });
      });

      it('should return records with symbolic usage ! usage', function(done) {
        User.find({ first_name: testName, age: { '!': 40 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });
    });

  });
});
