var Model = require('../support/crud.fixture'),
    assert = require('assert');

describe('Attribute Types', function() {

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

  describe('Float', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper float value', function(done) {
        User.create({ percent: 0.001 }, function(err, record) {
          assert(!err);
          assert(record.percent === 0.001);
          done();
        });
      });

    });
  });
});
