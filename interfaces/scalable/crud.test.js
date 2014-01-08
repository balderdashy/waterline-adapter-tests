// TODO: test basic CRUD functionality (semantic interface) at high concurrency

// TODO: measure memory usage
// TODO: measure execution time
// TODO: track any failures/errors


var Waterline = require('waterline'),
  Model = require('./support/crud.fixture'),
  assert = require('assert'),
  async = require('async');


describe('At scale,', function() {

  // TODO: try out `benchmark` library

  var User;

  before(function(done) {

    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({
      adapters: {
        test: Adapter
      }
    }, function(err, colls) {
      if (err) return done(err);
      User = colls.user;
      done();
    });
  });


  // Test create
  var CONCURRENCY = 10;
  runConcurrent(CONCURRENCY, function doFn () {
    var data = {
      first_name: _randomValue(),
      last_name: _randomValue(),
      email: _randomValue()
    };
    Adapter.create('loadTest', data, next);
  }, function assertConsistentFn (err, users, done) {
    assert(users.length === CONCURRENCY);
    done();
  });

});



/**
 * @return {Integer} a random value <= 100,000
 */
function _randomValue() {
  return Math.floor((Math.random() * 100000) + 1);
}



/**
 * `runConcurrent`
 * 
 * @param  {[type]} concurrency [# of simultaneous runs]
 * @param  {[type]} doFn     [action to repeat for each run]
 * @param  {[type]} assertConsistentFn    [assertion to check at the end]
 */
function runConcurrent (concurrency, doFn, assertConsistentFn) {
  describe('(with ' + concurrency + ' concurrent),', function() {
    
    it('should not error', function(done) {
      // generate x users
      async.times(concurrency, function(n, cb) {
        doFn(cb);
      }, function(err, users) {
        return assertConsistentFn(err, users, done);
      });
    });
  });
}
