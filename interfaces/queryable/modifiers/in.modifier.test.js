var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('IN Query Modifier', function() {

    describe('with a record', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = 'IN_query_test';

      before(function(done) {
        var users = [{ first_name: testName }, { first_name: 'something else' }];

        Queryable.User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      describe('when given an empty array', function () {

        it('should return an empty array', function(done) {

          Queryable.User.find({ first_name: [] }, function(err, users) {
            assert(users);
            assert.strictEqual(users.length, 0);
            done();
          });
        });
      });

      it('should return correct user', function(done) {
        Queryable.User.find({ first_name: ["foo", testName, "bar", "baz"] }, function(err, users) {
          assert.ifError(err);
          assert.equal(users.length, 1);
          assert.equal(users[0].first_name, testName);
          done();
        });
      });

      it('should return a model instance', function(done) {
        Queryable.User.find({ first_name: ["foo", testName, "bar", "baz"] }, function(err, users) {
          assert(users[0].id);
          assert.equal(typeof users[0].fullName, 'function');
          assert.equal(toString.call(users[0].createdAt), '[object Date]');
          assert.equal(toString.call(users[0].updatedAt), '[object Date]');
          done();
        });
      });
    });

    describe('without a record', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return an empty array', function(done) {
        Queryable.User.find({ first_name: ["foo", "bar", "baz"] }, function(err, users) {
          assert.strictEqual(users.length, 0);
          done();
        });
      });
    });

  });
});
