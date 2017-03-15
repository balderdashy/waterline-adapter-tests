var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('count()', function() {
    before(function(done) {
      Queryable.Userforqueryableinterface.destroy({}, function(err) {
        if (err) {
          return done(err);
        }

        // Insert 10 Users
        var users = [];
        for(var i=0; i<10; i++) {
          users.push({first_name: 'count_user' + i, type: 'count'});
        }

        Queryable.Userforqueryableinterface.createEach(users, function(err, users) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });
    });

    it('should accurately count records', function(done) {
      Queryable.Userforqueryableinterface.count({ type: 'count' }, function(err, count) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(count, 10);
        
        return done();
      });
    });
  });
});
