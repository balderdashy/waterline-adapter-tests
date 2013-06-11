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

    describe('endsWith', function() {

      describe('shorthand', function() {

        it('should return the user with the correct name', function(done) {
          var part = 'xxj8xa4hPFDH_short',
              testName = 'endsWith query test xxj8xa4hPFDH_short';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.endsWith({ first_name: part }, function(err, users) {
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
          var part = 'xxj8xa4hPFDH_long',
              testName = 'endsWith query test xxj8xa4hPFDH_long';

          User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            User.where({ first_name: { endsWith: part }}, function(err, users) {
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

        it('should have [attribute]EndsWith() method', function(done) {
          var part = 'xxj8xrxh!!!r',
              testType = 'Dynamic EndsWith test' + part;

          User.create({ type: testType }, function(err) {
            if(err) return done(err);

            User.typeEndsWith(part, function(err, users) {
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
