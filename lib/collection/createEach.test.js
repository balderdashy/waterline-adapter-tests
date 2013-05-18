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

  describe('.createEach()', function() {

    it('should create a set of users', function(done) {
      var usersArray = [
        { first_name: 'createEach_1', type: 'createEach' },
        { first_name: 'createEach_2', type: 'createEach' }
      ];

      User.createEach(usersArray, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 2);
        done();
      });
    });

    it('should insert 2 records verififed by findAll', function(done) {
      User.findAll({ type: 'createEach' }, function(err, users) {
        assert(!err);
        assert(users.length === 2);
        done();
      });
    });

    it('should return model instances', function(done) {
      var usersArray = [
        { first_name: 'createEach_3', type: 'createEach' },
        { first_name: 'createEach_4', type: 'createEach' }
      ];

      User.createEach(usersArray, function(err, users) {
        assert(users[0].id);
        assert(typeof users[0].fullName === 'function');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
