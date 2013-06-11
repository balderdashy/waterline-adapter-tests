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

    describe('contains', function() {

      describe('shorthand', function() {

        it('should return the user with the correct name', function(done) {
          var part = 'short_xx3ah4aj8xrxh!!!r',
              testName = 'short_xx3ah4aj8xrxh!!!r contains query test';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.contains({ first_name: part }, function(err, users) {
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

        it('should return the user with the correct name', function(done) {
          var part = 'long_xx3ah4aj8xrxh!!!r',
              testName = 'long_xx3ah4aj8xrxh!!!r contains query test';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.where({ first_name: { contains: part }}, function(err, users) {
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

        it('should have [attribute]contains() method', function(done) {
          var part = 'xxx',
              testType = 'Dynamic Contains test' + part + 'test';

          User.create({ type: testType }, function(err) {
            if(err) return done(err);

            User.typeContains(part, function(err, users) {
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
