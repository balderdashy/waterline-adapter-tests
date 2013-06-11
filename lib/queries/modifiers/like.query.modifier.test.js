var Model = require('../../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('Modifiers', function() {

    describe('LIKE', function() {

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
