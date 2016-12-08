var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.findOne()', function() {
    var id;

    // Insert a record to find
    before(function(done) {
      Semantic.User.create({ first_name: 'findOne test'}, function(err, record) {
        if (err) {
          return done(err);
        }

        id = record.id;
        
        return done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findOne({ first_name: 'findOne test' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOne test');
        
        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.findOne({ first_name: 'findOne test' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(user.id);
        assert(user.createdAt);
        assert(user.updatedAt);

        return done();
      });
    });

    it('should return null if a record is not found', function(done) {
      Semantic.User.findOne({ first_name: 'findOne blah' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(!user);
        
        return done();
      });
    });

    it('should work with just an id passed in', function(done) {
      Semantic.User.findOne(id, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOne test');
        
        return done();
      });
    });
  });
});
