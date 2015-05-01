/**
 * Module Dependencies
 */

var bootstrapFn = require('./bootstrapFn'),
    async = require('async');

/////////////////////////////////////////////////////
// TEST SETUP
////////////////////////////////////////////////////

var waterline, ontology;

before(function(done) {

  bootstrapFn(function(err, obj) {

    ontology = obj.ontology;
    waterline = obj.waterline;

    Object.keys(ontology.collections).forEach(function(key) {
      var globalName = key.charAt(0).toUpperCase() + key.slice(1);
      global.Migratable[globalName] = ontology.collections[key];
    });

    // Store the Waterline object as a global so it can be used in the tests
    global.Migratable.waterline = waterline;

    done();
  });
});

after(function(done) {

  function dropCollection(item, next) {
    if(!Adapter.hasOwnProperty('drop')) return next();

    ontology.collections[item].drop(function(err) {
      if(err) return next(err);
      next();
    });
  }

  async.each(Object.keys(ontology.collections), dropCollection, function(err) {
    if(err) return done(err);
    waterline.teardown(done);
  });

});
