var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.findOrCreate()', function() {
    it('should create a new record', function(done) {
      Semantic.User.findOrCreate({ first_name: 'findOrCreate()' }, { first_name: 'findOrCreate()' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOrCreate()');
        
        return done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findOrCreate({ first_name: 'findOrCreate()' }, { first_name: 'findOrCreate()' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOrCreate()');
        
        return done();
      });
    });

    it('should only have a single record in the database', function(done) {
      Semantic.User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 1);
        
        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.findOrCreate({ first_name: 'model findOrCreate()' }, { first_name: 'model findOrCreate()', last_name: 'test' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(user.id);
        assert(user.createdAt);
        assert(user.updatedAt);
        
        return done();
      });
    });
  });
});
