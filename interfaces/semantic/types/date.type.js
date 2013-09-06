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

  describe('Date', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper date value', function(done) {
        var date = new Date();
        User.create({ dob: date }, function(err, record) {
          assert(!err);

          // Convert both dates to unix timestamps
          var origDate = Date.parse(date);
          var resultDate = Date.parse(new Date(record.dob));

          assert(origDate === resultDate);
          done();
        });
      });

    });
  });
});
