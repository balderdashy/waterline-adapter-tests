// TODO: test basic CRUD functionality (semantic interface) at high concurrency

// TODO: measure memory usage
// TODO: measure execution time
// TODO: track any failures/errors


var Waterline = require('waterline'),
  Model = require('./support/crud.fixture'),
  assert = require('assert'),
  async = require('async');

var CONNECTIONS = 10000;

describe('Scalable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

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

  describe('with ' + CONNECTIONS + 'connections', function() {
    it('should not error', function(done) {

      // generate x users
      async.times(CONNECTIONS, function(n, next) {

        var data = {
          first_name: _randomValue(),
          last_name: _randomValue(),
          email: _randomValue()
        };

        Adapter.create('loadTest', data, next);
      }, function(err, users) {
        assert(!err);
        assert(users.length === CONNECTIONS);
        done();
      });
    });

  });
});


function _randomValue() {
  return Math.floor((Math.random() * 100000) + 1);
}
