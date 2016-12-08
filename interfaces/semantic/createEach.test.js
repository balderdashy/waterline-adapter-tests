var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.createEach()', function() {
    it('should create a set of users', function(done) {
      var usersArray = [
        { first_name: 'createEach_1', type: 'createEach' },
        { first_name: 'createEach_2', type: 'createEach' }
      ];

      Semantic.User.createEach(usersArray, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 2);

        return done();
      });
    });

    it('should insert 2 records verififed by find', function(done) {
      Semantic.User.find({ type: 'createEach' }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 2);
        
        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      var usersArray = [
        { first_name: 'createEach_3', type: 'createEach' },
        { first_name: 'createEach_4', type: 'createEach' }
      ];

      Semantic.User.createEach(usersArray, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(users[0].id);
        assert(users[0].createdAt);
        assert(users[0].updatedAt);

        return done();
      });
    });
  });
});
