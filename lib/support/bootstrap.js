/**
 * Wipe Database before tests are run and
 * after tests are run to ensure a clean test environment.
 */

var Fixtures = require('../fixtures');

// Global Before Helper
before(function(done) {

  var fixtures = [];

  Object.keys(Fixtures).forEach(function(key) {
    fixtures.push(Fixtures[key]);
  });

  return processItem(fixtures.pop());

  function processItem(item) {
    destroyModel(item, function(err) {
      if(err) return done(err);
      if(fixtures.length === 0) return done();

      processItem(fixtures.pop());
    });
  }
});

// Global After Helper
after(function(done) {
  var fixtures = [];

  Object.keys(Fixtures).forEach(function(key) {
    fixtures.push(Fixtures[key]);
  });

  return processItem(fixtures.pop());

  function processItem(item) {
    destroyModel(item, function(err) {
      if(err) return done(err);
      if(fixtures.length === 0) return done();

      processItem(fixtures.pop());
    });
  }
});


function destroyModel(Model, cb) {
  new Model({ adapters: { test: Adapter }}, function(err, model) {
    if(err) return cb(err);

    model.drop(function(err) {
      if(err) return cb(err);
      cb();
    });
  });
}
