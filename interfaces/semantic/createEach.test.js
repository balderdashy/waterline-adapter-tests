var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.createEach()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a set of users', function(done) {
      var usersArray = [
        { first_name: 'createEach_1', type: 'createEach' },
        { first_name: 'createEach_2', type: 'createEach' }
      ];

      Semantic.User.createEach(usersArray, function(err, users) {
        assert.ifError(err);
        assert(Array.isArray(users));
        assert.strictEqual(users.length, 2);
        done();
      });
    });

    it('should insert 2 records verififed by find', function(done) {
      Semantic.User.find({ type: 'createEach' }, function(err, users) {
        assert.ifError(err);
        assert.strictEqual(users.length, 2);
        done();
      });
    });

    it('should return model instances', function(done) {
      var usersArray = [
        { first_name: 'createEach_3', type: 'createEach' },
        { first_name: 'createEach_4', type: 'createEach' }
      ];

      Semantic.User.createEach(usersArray, function(err, users) {
        assert(users[0].id);
        assert.equal(typeof users[0].fullName, 'function');
        assert.equal(toString.call(users[0].createdAt), '[object Date]');
        assert.equal(toString.call(users[0].updatedAt), '[object Date]');
        done();
      });
    });

  });
});
