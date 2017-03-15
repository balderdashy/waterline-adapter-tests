var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('SUM Query Modifier', function() {
    before(function(done) {
      // Insert 10 Users
      var users = [];
      var date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'sum_user' + i,
          type: 'sum test',
          age: i
        });
      }

      Queryable.Userforqueryableinterface.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should sum by key', function(done) {
      Queryable.Userforqueryableinterface.sum('age')
      .where({ 
        type: 'sum test'
      })
      .exec(function(err, sum) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(sum, 45);
        
        return done();
      });
    });
  });
});
