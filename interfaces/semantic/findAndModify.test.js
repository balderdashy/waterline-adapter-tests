var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.findAndModfiy()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new model', function(done) {
      Semantic.User.findAndModfiy({ first_name: "findAndModfiy()" }, { first_name: "findAndModfiy()" },
      { upsert: true }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findAndModfiy()');
        done();
      });
    });

    it('should have created model', function(done) {
      Semantic.User.find({ first_name: 'fightOrModfiy)(' }, function(err, users) {
        assert(!err);
        assert(users.length === 1);
        assert(users[0].first_name === 'findAndModfiy()');
        done();
      });
    });

    it('should update existing model', function(done) {
      Semantic.User.findAndModfiy({ first_name: "findAndModfiy()" }, { first_name: "fightOrModfiy)(" }, function(err, user) {
        assert(!err);
        assert(user.length === 0);
        done();
      });
    });

    it('should have updated model', function(done) {
      Semantic.User.find({ first_name: 'fightOrModfiy)(' }, function(err, users) {
        assert(!err);
        assert(users.length === 1);
        assert(users[0].first_name === 'fightOrModfiy)(');
        done();
      });
    });

    it('should return an empty array if model does not exist', function(done) {
      Semantic.User.findAndModfiy({ first_name: "never-created!" }, { first_name: "fightOrModfiy)(" }, function(err, user) {
        assert(!err);
        assert(user.length === 0);
        done();
      });
    });

    it('should create model but return empty array new: false', function(done) {
      Semantic.User.findAndModfiy({ first_name: "findAndModfiy()" }, { first_name: "new-test" },
      { upsert: true, new: false }, function(err, user) {
        assert(!err);
        assert(user.length === 0);
        done();
      });
    });

    it('should return a single record', function(done) {
      Semantic.User.findAndModfiy({ first_name: "new-test" }, { first_name: "findAndModfiy()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findAndModfiy()');
        done();
      });
    });

    it('should return a model instance', function(done) {
     Semantic.User.findAndModfiy({ first_name: "model findAndModfiy()" }, { first_name: "model findAndModfiy()", last_name: 'test' }, function(err, user) {
        assert(user.id);
        assert(user.fullName() === 'model findAndModfiy() test');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

    it('should error when no values given', function(done) {
     Semantic.User.findAndModfiy({ first_name: "findAndModfiy()", last_name: 'search criteria' }, function(err, user) {
        assert(!user);
        assert(err);
        done();
      });
    });

    it('should accept array of objects', function(done) {
     Semantic.User.findAndModfiy(
      [
        { first_name: "findAndModfiy()" },
        { first_name: 'Mark', last_name: 'Vegetables'}],
      [
        { first_name: "findAndModfiy()", last_name: 'array' },
        { first_name: 'Mark', last_name: 'Vegetables'}
      ], { upsert: true },
      function(err, users) {
        assert(users[0].id);
        assert(users[0].fullName() === 'findAndModfiy() array');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');

        assert(users[1].id);
        assert(users[1].fullName() === 'Mark Vegetables');
        assert(toString.call(users[1].createdAt) == '[object Date]');
        assert(toString.call(users[1].updatedAt) == '[object Date]');
        done();
      });
    });

    it('should return error if search criteria length does not match values', function(done) {
      Semantic.User.findAndModfiy(
        [
          { first_name: "findAndModfiy()" },
          { first_name: 'Marki'}],
        [
          { first_name: "findAndModfiy()", last_name: 'error' },
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
