var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('endsWith', function() {
      describe('shorthand', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return the user with the correct name', function(done) {
          var part = 'xxj8xa4hPFDH_short',
              testName = 'endsWith query test xxj8xa4hPFDH_short';

          Queryable.User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            Queryable.User.endsWith({ first_name: part }, function(err, users) {
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
          var part = 'xxj8xa4hPFDH_long',
              testName = 'endsWith query test xxj8xa4hPFDH_long';

          Queryable.User.create({ first_name: testName }, function(err) {
            if(err) return done(err);

            Queryable.User.where({ first_name: { endsWith: part }}, function(err, users) {
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

        it('should have [attribute]EndsWith() method', function(done) {
          var part = 'xxj8xrxh!!!r',
              testType = 'Dynamic EndsWith test' + part;

          Queryable.User.create({ type: testType }, function(err) {
            if(err) return done(err);

            Queryable.User.typeEndsWith(part, function(err, users) {
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
