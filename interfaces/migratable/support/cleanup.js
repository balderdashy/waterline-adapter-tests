var Waterline = require('waterline');

describe('Migratable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST CLEANUP
  ////////////////////////////////////////////////////

  var fixtures = {
    User: require('./crud.fixture'),
    Document: require('./schema.fixture')
  };

  after(function(done) {
    var waterline = new Waterline();

    Object.keys(fixture).forEach(function(key) {
      waterline.loadCollection(fixture[key]);
    });

    // Drop each collection if a `drop` method is defined
    waterline.initialize({ adapters: { test: Adapter }}, function(err, models) {
      if(err) return cb(err);

      async.each(Object.keys(models), function(item, nextModel) {
        if(!Adapter.hasOwnProperty('drop')) return nextModel();

        models[item].drop(function(err) {
          if(err) return nextModel(err);
          next();
        });
      }, done);
    });

  });
});
