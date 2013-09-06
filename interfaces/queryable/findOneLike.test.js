var Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
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
