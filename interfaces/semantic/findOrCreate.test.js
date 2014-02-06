var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.findOrCreate()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should only have a single record in the database', function(done) {
      Semantic.User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        assert(!err);
        assert(users.length === 1);
        done();
      });
    });

    it('should return a model instance', function(done) {
     Semantic. User.findOrCreate({ first_name: "model findOrCreate()" }, { first_name: "model findOrCreate()", last_name: 'test' }, function(err, user) {
        assert(user.id);
        assert(user.fullName() === 'model findOrCreate() test');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
