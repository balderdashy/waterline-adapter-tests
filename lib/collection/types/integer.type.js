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

  describe('Integer', function() {

    describe('with valid data', function() {

      it('should store proper integer', function(done) {
        User.create({ age: 27 }, function(err, record) {
          assert(!err);
          assert(record.age === 27);
          done();
        });
      });

    });

  });
});
