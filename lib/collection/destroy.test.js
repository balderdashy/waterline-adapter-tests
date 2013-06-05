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

  describe('.destroy()', function() {

    // Create a user to test destroy on
    before(function(done) {
      User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err) {
        if(err) return done(err);
        done();
      });
    });

    it('should destroy a record', function(done) {
      User.destroy({ first_name: 'Destroy' }, function(err, status) {
        assert(!err);
        done();
      });
    });

    it('should return an empty array when searched for', function(done) {
      User.find({ first_name: 'Destroy' }, function(err, users) {
        assert(users.length === 0);
        done();
      });
    });

  });
});
