var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

  describe('.findLike()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return all the users with the given name', function(done) {
      var part = 'findLike',
          testName = 'zz 340ajsdha test_findLike -- aw40gasdha',
          testName2 = 'zz zzbjfk test_findLike2../haer-h';

      User.createEach([{ first_name: testName }, { first_name: testName2 }], function(err) {
        if (err) return done(err);

        User.findLike({ first_name: part }, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].first_name === testName);
          assert(users[1].first_name === testName2);
          done();
        });
      });
    });

  });
});
