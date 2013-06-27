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

  describe('String', function() {

    describe('with valid data', function() {

      it('should store proper string value', function(done) {
        User.create({ first_name: 'Foo' }, function(err, record) {
          assert(!err);
          assert(record.first_name === 'Foo');
          done();
        });
      });

    });

  });
});
