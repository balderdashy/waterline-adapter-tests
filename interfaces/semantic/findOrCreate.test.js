var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.findOrCreate()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert.ifError(err);
        assert.equal(user.first_name, 'findOrCreate()');
        done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert.ifError(err);
        assert.equal(user.first_name, 'findOrCreate()');
        done();
      });
    });

    it('should only have a single record in the database', function(done) {
      Semantic.User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        assert.ifError(err);
        assert.strictEqual(users.length, 1);
        done();
      });
    });

    it('should return a model instance', function(done) {
     Semantic.User.findOrCreate({ first_name: "model findOrCreate()" }, { first_name: "model findOrCreate()", last_name: 'test' }, function(err, user) {
        assert(user.id);
        assert.equal(user.fullName(), 'model findOrCreate() test');
        assert.equal(toString.call(user.createdAt), '[object Date]');
        assert.equal(toString.call(user.updatedAt), '[object Date]');
        done();
      });
    });

    it('should take search criteria as values', function(done) {
     Semantic.User.findOrCreate({ first_name: "findOrCreate()", last_name: 'search criteria' }, function(err, user) {
        assert(user.id);
        assert.equal(user.fullName(), 'findOrCreate() search criteria');
        assert.equal(toString.call(user.createdAt), '[object Date]');
        assert.equal(toString.call(user.updatedAt), '[object Date]');
        done();
      });
    });

    it('should accept array of objects', function(done) {
     Semantic.User.findOrCreate([
       { first_name: "findOrCreate()", last_name: 'array' },
       { first_name: 'Mark', last_name: 'Vegetables'}], function(err, users) {
        assert(users[0].id);
        assert.equal(users[0].fullName(), 'findOrCreate() array');
        assert.equal(toString.call(users[0].createdAt), '[object Date]');
        assert.equal(toString.call(users[0].updatedAt), '[object Date]');

        assert(users[1].id);
        assert.equal(users[1].fullName(), 'Mark Vegetables');
        assert.equal(toString.call(users[1].createdAt), '[object Date]');
        assert.equal(toString.call(users[1].updatedAt), '[object Date]');
        done();
      });
    });

    it('should return error if search criteria length does not match values', function(done) {
      Semantic.User.findOrCreate(
        [
          { first_name: "findOrCreate()" },
          { first_name: 'Marki'}],
        [
          { first_name: "findOrCreate()", last_name: 'error' },
          { first_name: 'Marki', last_name: 'Steak' },
          { first_name: 'Max', last_name: 'Nofit' }
        ],
        function(err, users) {
          assert(!users);
          assert(err);
          done();
      });
    });

  });
});
