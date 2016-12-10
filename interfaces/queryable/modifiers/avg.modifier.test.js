var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('AVG Query Modifier', function() {
    before(function(done) {
      // Insert 10 Users
      var users = [];
      var date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'average_user' + i,
          type: 'average test',
          age: i
        });
      }

      Queryable.User.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should average by key and only return that key with the average value', function(done) {
      Queryable.User.avg('age', { where:{ type: 'average test' }}, function(err, average) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(average, 4.5, 'expected average to === 4.5, instead average === ' + average);
        
        return done();
      });
    });
  });
});
