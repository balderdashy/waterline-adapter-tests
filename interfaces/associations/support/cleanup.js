var Waterline = require('waterline');

describe.skip('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST CLEANUP
  ////////////////////////////////////////////////////

  var fixtures = {
    Payment: require('./belongsTo.fixture'),
    Customer: require('./hasMany.fixture'),
    Taxi: require('./manyToMany.taxi.fixture'),
    Driver: require('./manyToMany.driver.fixture')
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
