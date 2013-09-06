var Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.findOrCreate()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should return a single record', function(done) {
      User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should only have a single record in the database', function(done) {
      User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        assert(!err);
        assert(users.length === 1);
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.findOrCreate({ first_name: "model findOrCreate()" }, { first_name: "model findOrCreate()", last_name: 'test' }, function(err, user) {
        assert(user.id);
        assert(user.fullName() === 'model findOrCreate() test');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
