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

  describe('Boolean', function() {

    describe('with valid data', function() {

      it('should store proper boolean value', function(done) {
        User.create({ status: true }, function(err, record) {
          assert(!err);
          assert(record.status === true);
          done();
        });
      });

    });

  });
});
