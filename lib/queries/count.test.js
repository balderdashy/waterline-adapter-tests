var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('count()', function() {

    // Start with an known database state to accurately test count
    before(function(done) {
      User.destroyAll(function(err) {
        if(err) return done(err);

        // Insert 10 Users
        var users = [];
        for(var i=0; i<10; i++) {
          users.push({first_name: 'count_user' + i, type: 'count'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);
          done();
        });
      });
    });


    it('should accurately count records', function(done) {
      User.count({ type: 'count' }, function(err, count) {
        assert(!err);
        assert(count === 10);
        done();
      });
    });

    it('should work with dynamic finders', function(done) {
      User.countByType('count', function(err, count) {
        assert(!err);
        assert(count === 10);
        done();
      });
    });

  });
});
