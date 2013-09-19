/**
 * Cleans Up Test Database
 */

var Waterline = require('waterline'),
    async = require('async'),
    collections = {};

Events.on('fixture', function(collection) {
  var name = collection.prototype.tableName || collection.prototype.identity;
  collections[name] = collection;
});


after(function(done) {
  var waterline = new Waterline();

  Object.keys(collections).forEach(function(key) {
    waterline.loadCollection(collections[key]);
  });

  // Drop each collection if a `drop` method is defined
  waterline.initialize({ adapters: { test: Adapter }}, function(err, models) {
    if(err) return done(err);

    async.each(Object.keys(models), function(item, next) {
      if(!Adapter.hasOwnProperty('drop')) return next();

      models[item].drop(function(err) {
        if(err) return next(err);
        next();
      });
    }, done);
  });
});
