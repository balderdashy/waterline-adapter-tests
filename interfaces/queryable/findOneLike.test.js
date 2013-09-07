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

  describe('.findOneLike()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the user with the given name', function(done) {
      var part = 'findOneLike',
          testName = 'asdgah4 test_findOneLike asg';

      User.create({ first_name: testName }, function(err) {
        if (err) return done(err);

        User.findOneLike({ first_name: part }, function(err, user) {
          assert(!err);
          assert(user.first_name === testName);
          done();
        });
      });
    });

  });
});
