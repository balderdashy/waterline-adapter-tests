var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.create()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      Semantic.User.create({ first_name: 'Foo' }, function(err, record) {
        if (err) { console.error(err); }
        assert.ifError(err);
        assert.equal(record.first_name, 'Foo');
        done();
      });
    });

    it('should return a generated PK', function(done) {
      Semantic.User.create({ first_name: 'FooBar' }, function(err, user) {
        if (err) { console.error(err); }
        assert.ifError(err);
        assert.equal(user.first_name, 'FooBar');
        assert(user.id);
        done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.create({ first_name: 'Foo', last_name: 'Bar' }, function(err, user) {
        if (err) { console.error(err); }
        assert.ifError(err);
        assert.equal(toString.call(user.createdAt), '[object Date]');
        assert.equal(toString.call(user.updatedAt), '[object Date]');
        done();
      });
    });

    it('should return a model instance', function(done) {
      Semantic.User.create({ first_name: 'Foo', last_name: 'Bar' }, function(err, user) {
        if (err) { console.error(err); }
        assert.ifError(err);
        assert.equal(user.fullName(), 'Foo Bar');
        done();
      });
    });

    it('should normalize undefined values to null', function(done) {
      Semantic.User.create({ first_name: 'Yezy', last_name: undefined }, function(err, user) {
        assert.ifError(err);
        assert.equal(user.last_name, null);
        done();
      });
    });

    it('should return rows in the correct order when creating multiple rows', function(done) {
      var testName = '.create() with a list, returning values';
      var users = [];

      for(var i=0; i<30; i++) {
        users.push({ first_name: 'test_' + i, type: testName });
      }
      Semantic.User.create(users, function(err, users) {
        assert.ifError(err);
        users.forEach(function(val, idx){
          assert.equal(users[idx].first_name, 'test_' + idx);
        });
        assert.equal(users.length, 30, 'Expecting 30 "users", but actually got '+users.length+': '+require('util').inspect(users, false, null));
        done();
      });
    });

    describe('overloaded usage of create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = '.create() test create a list';

      before(function(done) {
        var users = [];

        for(var i=0; i<4; i++) {
          users.push({ first_name: 'test_' + i, type: testName });
        }

        Semantic.User.create(users, done);
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should have saved the proper values (with auto-increment values)', function(done) {
        Semantic.User.find({where : { type: testName }, sort : {first_name : 1}}, function(err, users) {
          if (err) return done(err);
          assert.ifError(err);
          assert.equal(users.length, 4, 'Expecting 4 "users", but actually got '+users.length+': '+require('util').inspect(users, false, null));
          assert.equal(users[0].first_name, 'test_0' );
          done();
        });
      });
    });

  });
});
