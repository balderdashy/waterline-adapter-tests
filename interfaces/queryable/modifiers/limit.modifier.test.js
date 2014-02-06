var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('LIMIT Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'limit_user' + i, type: 'limit test'});
      }

      Queryable.User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the correct amount of records', function(done) {
      Queryable.User.find({ where: { type: 'limit test' }, limit: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 3);
        done();
      });
    });

    it('dynamic finder usage should return the correct amount of records', function(done) {
      Queryable.User.findByType('limit test', { limit: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 3);
        done();
      });
    });

    it('as an option should return correct amount of records', function(done) {
      Queryable.User.find({ where: { type: 'limit test' } }, { limit: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 3);
        done();
      });
    });

  });
});
