var Model = require('../../fixtures/crud'),
    assert = require('assert');

describe('Attribute Types', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('Date', function() {

    describe('with valid data', function() {

      it('should store proper date value', function(done) {
        var date = new Date();
        User.create({ dob: date }, function(err, record) {
          assert(!err);

          // Convert both dates to unix timestamps
          var origDate = Date.parse(date),
              resultDate = Date.parse(new Date(record.dob));

          assert(origDate === resultDate);
          done();
        });
      });

    });

  });
});
