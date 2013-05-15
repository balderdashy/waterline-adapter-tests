/**
 * Wipe Database before tests are run and
 * after tests are run to ensure a clean test environment.
 */

var Model = require('../fixtures/crud');

// Global Before Helper
before(function(done) {
  new Model({ adapters: { test: Adapter }}, function(err, User) {
    if(err) return done(err);

    User.drop(function(err) {
      if(err) return done(err);
      done();
    });
  });
});

// Global After Helper
after(function(done) {
  new Model({ adapters: { test: Adapter }}, function(err, User) {
    if(err) return done(err);

    User.drop(function(err) {
      if(err) return done(err);
      done();
    });
  });
});
