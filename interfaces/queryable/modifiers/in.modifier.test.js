var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('IN Query Modifier', function() {
    describe('with a record', function() {
      var testName = 'IN_query_test';

      before(function(done) {
        var users = [
          { 
            first_name: testName 
          }, 
          { 
            first_name: 'something else' 
          }
        ];

        Queryable.Userforqueryableinterface.createEach(users, function(err) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });

      describe('when given an empty array', function () {
        it('should return an empty array', function(done) {
          Queryable.Userforqueryableinterface.find({ first_name: [] }, function(err, users) {
            if (err) {
              return done(err);
            }

            assert.equal(users.length, 0);
  
            return done();
          });
        });
      });

      it('should return correct user', function(done) {
        Queryable.Userforqueryableinterface.find({ first_name: ['foo', testName, 'bar', 'baz'] }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.equal(users.length, 1);
          assert.equal(users[0].first_name, testName);
          
          return done();
        });
      });
    });

    describe('without a record', function() {
      it('should return an empty array', function(done) {
        Queryable.Userforqueryableinterface.find({ first_name: ["foo", "bar", "baz"] }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 0);
          
          return done();
        });
      });
    });
  });
});
