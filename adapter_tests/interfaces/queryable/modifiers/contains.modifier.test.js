var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('contains', function() {
      describe('shorthand', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return the user with the correct name', function(done) {
          var part = 'short_xx3ah4aj8xrxh!!!r',
              testName = 'short_xx3ah4aj8xrxh!!!r contains query test';

          Queryable.User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            Queryable.User.contains({ first_name: part }, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].first_name === testName);
              done();
            });
          });
        });
      });

      describe('full where criteria', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return the user with the correct name', function(done) {
          var part = 'long_xx3ah4aj8xrxh!!!r',
              testName = 'long_xx3ah4aj8xrxh!!!r contains query test';

          Queryable.User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            Queryable.User.where({ first_name: { contains: part }}, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].first_name === testName);
              done();
            });
          });
        });
      });

      describe('dynamic attribute', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should have [attribute]contains() method', function(done) {
          var part = 'xxx',
              testType = 'Dynamic Contains test' + part + 'test';

          Queryable.User.create({ type: testType }, function(err) {
            if(err) return done(err);

            Queryable.User.typeContains(part, function(err, users) {
              assert(!err);
              assert(Array.isArray(users));
              assert(users.length === 1);
              assert(users[0].type === testType);
              done();
            });
          });
        });
      });

    });
  });
});
