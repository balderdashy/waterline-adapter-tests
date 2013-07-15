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

  describe('JSON', function() {

    describe('with valid data', function() {

      it('should store proper object value', function(done) {
        User.create({ obj: {foo: 'bar'} }, function(err, record) {
          assert(!err);
          assert(record.obj === Object(record.obj));
          assert(record.obj.foo === 'bar');
          done();
        });
      });

    });

  });
});
