var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('like modifier', function() { 
    var testName = 'zz 340ajsdha test_findLike -- aw40gasdha';
    var testName2 = 'zz zzbjfk test_findLike2../haer-h';

    before(function(done) {
      var records = [
        { 
          first_name: testName 
        }, 
        { 
          first_name: testName2 
        }
      ];

      Queryable.Userforqueryableinterface.createEach(records, done);
    });

    it('should return all the users with the given name', function(done) {
      var part = '%findLike%';
      
      Queryable.Userforqueryableinterface.find({ 
        first_name: { 
          like: part 
        }
      }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 2, util.format('expected 2 users, but got %s, see?\n%s', users.length, util.inspect(users, false, null) ));
        assert((users[0].first_name === testName && users[1].first_name === testName2) ||
                 (users[0].first_name === testName2 && users[1].first_name === testName))
        return done();
      });
    });
  });
});
