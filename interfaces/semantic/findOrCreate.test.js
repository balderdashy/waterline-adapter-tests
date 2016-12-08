var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe.skip('.findOrCreate()', function() {
    it('should create a new record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOrCreate()');
        
        return done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'findOrCreate()');
        
        return done();
      });
    });

    it('should only have a single record in the database', function(done) {
      Semantic.User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 1);
        
        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.findOrCreate({ first_name: "model findOrCreate()" }, { first_name: "model findOrCreate()", last_name: 'test' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(user.id);
        assert.equal(user.fullName(), 'model findOrCreate() test');
        assert(user.createdAt);
        assert(user.updatedAt);
        
        return done();
      });
    });

    it('should take search criteria as values', function(done) {
     Semantic.User.findOrCreate({ first_name: "findOrCreate()", last_name: 'search criteria' }, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(user.id);
        assert.equal(user.fullName(), 'findOrCreate() search criteria');
        assert(user.createdAt);
        assert(user.updatedAt);
        
        return done();
      });
    });

    it('should accept array of objects', function(done) {
     Semantic.User.findOrCreate([
       { first_name: "findOrCreate()", last_name: 'array' },
       { first_name: 'Mark', last_name: 'Vegetables'}
      ], function(err, users) {
        if (err) {
          return done(err);
        }

        assert(users[0].id);
        assert.equal(users[0].fullName(), 'findOrCreate() array');
        assert(users[0].createdAt);
        assert(users[0].updatedAt);

        assert(users[1].id);
        assert.equal(users[1].fullName(), 'Mark Vegetables');
        assert(users[1].createdAt);
        assert(users[1].updatedAt);
   
        return done();
      });
    });

    it('should return error if search criteria length does not match values', function(done) {
      Semantic.User.findOrCreate([
        { first_name: "findOrCreate()" },
        { first_name: 'Marki'}],
      [
        { first_name: "findOrCreate()", last_name: 'error' },
        { first_name: 'Marki', last_name: 'Steak' },
        { first_name: 'Max', last_name: 'Nofit' }
      ], function(err, users) {
        assert(err);
        assert(!users);
        done();
      });
    });
  });
});
