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
  
  // console.log('\n\n\n\n******\nRunning mocha after all hook...');

  // Drop each collection if a `drop` method is defined
  waterline.initialize({
    adapters: {
      wl_tests: Adapter
    },
    connections: Connections
  }, function(err, colls) {

    // console.log('Bootstrapped waterline one last time after all tests- got error:'  ,err);
    if (err) return done(err);

    // console.log(waterline.schema);


    async.each(Object.keys(colls.collections).reverse(), function(item, next) {
      if (!Adapter.hasOwnProperty('drop')) return next();

      // log.verbose('dropping '+item+'......');
      colls.collections[item].drop(function(err) {
        if (err) {
          // Tolerate 'drop' errors during post-test cleanup.
          // e.g. "Error: ER_NO_SUCH_TABLE: Table 'sails_mysql.venue' doesn't exist"
          return next(err);

          // Instead of:
          // return next(err);
        }
        next();
      });
    }, function (err) {
      if (err) return done(err);
      waterline.teardown(done);
    });
  });
});