var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Collection', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.find()', function() {

    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'find_user' + i, type: 'find test', age: i*10 });  // include the an integrer field
      }

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    it('should return 10 records', function(done) {
      User.find({ type: 'find test' }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 10);
        done();
      });
    });
    /**
     * Test searching by integer
     */
    it('should return 1 record when searching for a specific record (integer test) with find', function(done) {
      User.find({ age: 10 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 1);
        done();
      });
    });

    // using criteria
    it('should return 1 record when searching for a specific record (integer test) with find', function(done) {
      User.find({
	      	age: {
	      		lessThanOrEqual: 49 // should return half the records - from 0 to 40
	      	}
	    }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert.equal(users.length, 5);
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.find({ type: 'find test' }, function(err, users) {
        assert(users[0].id);
        assert(typeof users[0].fullName === 'function');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');
        done();
      });
    });

    it('should work with no criteria passed in', function(done) {
      User.find(function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        done();
      });
    });

  });
});
