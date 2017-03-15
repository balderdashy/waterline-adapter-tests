var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('LIMIT Query Modifier', function() {
    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'limit_user' + i, type: 'limit test'});
      }

      Queryable.Userforqueryableinterface.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should return the correct amount of records', function(done) {
      Queryable.Userforqueryableinterface.find({ where: { type: 'limit test' }, limit: 3 }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 3);
        
        return done();
      });
    });

    it('as an option should return correct amount of records', function(done) {
      Queryable.Userforqueryableinterface.find({ where: { type: 'limit test' }, limit: 3 }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(users));
        assert.strictEqual(users.length, 3);
        
        return done();
      });
    });
  });
});
