var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.find()', function() {
    before(function(done) {
      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'find_user' + i, type: 'find test', age: i*10 });  // include an integer field
      }

      Semantic.User.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should return 10 records', function(done) {
      Semantic.User.find({ type: 'find test' }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 10);

        return done();
      });
    });

    it('should return 1 record when searching for a specific record (integer test) with find', function(done) {
      Semantic.User.find({ age: 10 }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 1);

        return done();
      });
    });

    it('should parse multi-level criteria', function(done) {
      Semantic.User.find({
        age: {
          '<=': 49 // should return half the records - from 0 to 40
        },
        type: 'find test'
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.equal(users.length, 5);
        
        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.find({ type: 'find test' }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(users[0].id);
        assert(users[0].createdAt);
        assert(users[0].updatedAt);
        
        return done();
      });
    });

    it('should work with no criteria passed in', function(done) {
      Semantic.User.find()
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        
        return done();
      });
    });
  });
});
