/**
 * Wipe Database before tests are run and
 * after tests are run to ensure a clean test environment.
 */

var CrudModel = require('../fixtures/crud'),
    SchemaOptions = require('../fixtures/schema-options');

// Global Before Helper
before(function(done) {
  destroyModel(CrudModel, function(err) {
    if(err) return done();
    destroyModel(SchemaOptions, function(err) {
      done();
    });
  });
});

// Global After Helper
after(function(done) {
  destroyModel(CrudModel, function(err) {
    if(err) return done();
    destroyModel(SchemaOptions, function(err) {
      done();
    });
  });
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
