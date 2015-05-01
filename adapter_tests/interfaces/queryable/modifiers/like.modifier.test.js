var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {

    describe('LIKE', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the user with the given name', function(done) {
        var part = '%LIKE query test%',
            testName = '24g LIKE query test asdcxbzbasg';

        Queryable.User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          Queryable.User.find({ like: { first_name: part } }, function(err, users) {
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

        Queryable.User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          Queryable.User.find({ like: { first_name: '%'+part+'%' } }, function(err, users) {
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
