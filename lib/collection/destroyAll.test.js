var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Collection', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.destroyAll()', function() {

    // Create a user to test destroy on
    beforeEach(function(done) {
      User.createEach([
        { first_name: 'dummy_test' },
        { first_name: 'dummy_test' },
        { first_name: 'dummy_test' }
      ], done);
    });

    it('should destroy all the records', function(done) {
      User.destroyAll(function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        done();
      });
    });

    it('should return an empty array when searched for', function(done) {
      User.findAll({ first_name: 'Destroy' }, function(err, users) {
        assert(users.length === 0);
        done();
      });
    });

  });
});
