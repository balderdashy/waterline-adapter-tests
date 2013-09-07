var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
    assert = require('assert');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

  describe('Modifiers', function() {

    describe('LIKE', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the user with the given name', function(done) {
        var part = 'LIKE query test',
            testName = '24g LIKE query test asdcxbzbasg';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.find({ like: { first_name: part } }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === testName);
            done();
          });
        });
      });

      it('should support wrapping both sides with a % sign', function(done) {
        var part = 'LIKE query test with sign',
            testName = '24gdddaga4 LIKE query test with sign asdcxbzbasg';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.find({ like: { first_name: '%'+part+'%' } }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === testName);
            done();
          });
        });
      });
    });

  });
});
