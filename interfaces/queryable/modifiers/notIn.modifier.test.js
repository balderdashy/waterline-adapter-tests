var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('NOT IN Query Modifier', function() {
    var testName = 'NOT_IN_query_test';

    // Delete all the users in the collection
    before(function(done) {
      Queryable.User.destroy().exec(done);
    });

    describe('with a record', function() {
      before(function(done) {
        var users = [
          { 
            first_name: testName 
          }, 
          { 
            first_name: 'something else' 
          }
        ];

        Queryable.User.createEach(users, function(err) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });

      it('should return correct user', function(done) {
        Queryable.User.find({ 
          first_name: { 
            'nin': ['foo', testName, 'bar', 'baz'] 
          }
        })
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 1);
          assert.equal(users[0].first_name, 'something else');
          
          return done();
        });
      });
    });

    describe('without a record', function() {
      it('should return an empty array', function(done) {
        Queryable.User.find({ 
          first_name: { 
            'nin': ['foo', testName, 'bar', 'something else'] 
          }
        })
        .exec(function(err, users) {
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
