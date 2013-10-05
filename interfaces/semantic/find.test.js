var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

  describe('.find()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'find_user' + i, type: 'find test', age: i*10 });  // include an integer field
      }

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return 10 records', function(done) {
      User.find({ type: 'find test' }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 10);
        done();
      });
    });

    it('should return 1 record when searching for a specific record (integer test) with find', function(done) {
      User.find({ age: 10 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 1);
        done();
      });
    });

    it('should parse multi-level criteria', function(done) {
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
