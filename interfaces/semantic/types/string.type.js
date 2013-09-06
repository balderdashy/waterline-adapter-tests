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

  describe('String', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

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
