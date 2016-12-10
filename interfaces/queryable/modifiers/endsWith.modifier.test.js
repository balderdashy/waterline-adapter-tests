var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe.skip('endsWith', function() {
      describe('shorthand', function() {
        it('should return the user with the correct name', function(done) {
          var part = 'xxj8xa4hPFDH_short';
          var testName = 'endsWith query test xxj8xa4hPFDH_short';

          Queryable.User.create({ first_name: testName }, function(err) {
            if (err) {
              return done(err);
            }

            Queryable.User.endsWith({ first_name: part }, function(err, users) {
              if (err) {
                return done(err);
              }

              assert(_.isArray(users));
              assert.equal(users.length, 1);
              assert.equal(users[0].first_name, testName);
              
              return done();
            });
          });
        });
      });

      describe('full where criteria', function() {
        it('should return the user with the correct name', function(done) {
          var part = 'xxj8xa4hPFDH_long';
          var testName = 'endsWith query test xxj8xa4hPFDH_long';

          Queryable.User.create({ first_name: testName }, function(err) {
            if (err) {
              return done(err);
            }

            Queryable.User.where({ first_name: { endsWith: part }}, function(err, users) {
              if (err) {
                return done(err);
              }

              assert(Array.isArray(users));
              assert.equal(users.length, 1);
              assert.equal(users[0].first_name, testName);
              
              return done();
            });
          });
        });
      });
    });
  });
});
