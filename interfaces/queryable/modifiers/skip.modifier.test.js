var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('SKIP Query Modifier', function() {
    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'skip_user' + i, 
          type: 'skip test'
        });
      }

      Queryable.User.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should return the correct amount of records', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'skip test' 
        }, 
        skip: 3 
      }).exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert(Array.isArray(users));
        assert.strictEqual(users.length, 7);
        
        return done();
      });
    });

    it('as an option should return correct amount of records', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'skip test' 
        } 
      }, 
      { 
        skip: 3 
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert(Array.isArray(users));
        assert.strictEqual(users.length, 7);
        
        return done();
      });
    });
  });
});
