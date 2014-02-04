/**
 * Module dependencies
 */
var Waterline = require('waterline'),
    async = require('async');



/**
 * Drop each collection in the specified object.
 * 
 * @param  {Object}   collections [description]
 * @param  {Function} cb          [description]
 */

module.exports = function cleanOutTestDb (collections, cb) {

  var waterline = new Waterline();

  Object.keys(collections).forEach(function(key) {
    waterline.loadCollection(collections[key]);
  });

  // Drop each collection if a `drop` method is defined
  console.log('initializing... (with '+Object.keys(collections).length+' collections)');
  waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
    if(err) return cb(err);
    console.log('initialized');

    async.each(Object.keys(colls.collections), function(item, next) {
      if(!Adapter.hasOwnProperty('drop')) return next();

      colls.collections[item].drop(function(err) {
        if(err) return next(err);
        next();
      });
    }, function (err) {
      if (err) return cb(err);
      waterline.teardown(cb);
    });
  });

};
