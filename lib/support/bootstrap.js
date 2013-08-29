/**
 * Wipe Database before tests are run and
 * after tests are run to ensure a clean test environment.
 */

var async = require('async'),
    Waterline = require('waterline'),
    Fixtures = require('../fixtures');

// Global Before Helper
before(function(done) {
  destroyModels(done);
});

// Global After Helper
after(function(done) {
  destroyModels(done);
});


function destroyModels(cb) {
  var waterline = new Waterline();

  Object.keys(Fixtures).forEach(function(key) {
    waterline.loadCollection(Fixtures[key]);
  });

  waterline.initialize({ adapters: { test: Adapter }}, function(err, models) {
    if(err) return cb(err);

    async.each(Object.keys(models), function(item, next) {
      models[item].drop(function(err) {
        if(err) return next(err);
        next();
      });
    }, cb);
  });
}
