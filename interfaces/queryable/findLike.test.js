var assert = require('assert');
var util = require('util');
var _ = require('lodash');


describe('Queryable Interface', function() {

  describe('.findLike()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return all the users with the given name', function(done) {
      var part = '%findLike%',
          testName = 'zz 340ajsdha test_findLike -- aw40gasdha',
          testName2 = 'zz zzbjfk test_findLike2../haer-h';

      Queryable.User.createEach([{ first_name: testName }, { first_name: testName2 }], function(err) {
        if (err) return done(err);

        Queryable.User.findLike({ first_name: part }, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 2, util.format('expected 2 users, but got %s, see?\n%s', users.length, util.inspect(users, false, null) ));
          assert(users[0].first_name === testName);
          assert(users[1].first_name === testName2);
          done();
        });
      });
    });

  });
});
