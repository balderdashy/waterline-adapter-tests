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

  describe('Array', function() {

    describe('with valid data', function() {

      it('should store proper array value', function(done) {
        User.create({ list: [0,1,2,3] }, function(err, record) {
          assert(!err);
          assert(Array.isArray(record.list));
          assert(record.list.length === 4);
          done();
        });
      });

    });

  });
});
