var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.create()', function() {
    it('should create a new record', function(done) {
      Semantic.User.create({ first_name: 'Foo' }, function(err, record) {
        if (err) { 
          return done(err);
        }

        assert.equal(record.first_name, 'Foo');
        
        return done();
      });
    });

    it('should return a generated PK', function(done) {
      Semantic.User.create({ first_name: 'FooBar' }, function(err, user) {
        if (err) { 
          return done(err);
        }

        assert.equal(user.first_name, 'FooBar');
        assert(user.id);

        return done();
      });
    });

    it('should return generated timestamps', function(done) {
      Semantic.User.create({ first_name: 'Foo', last_name: 'Bar' }, function(err, user) {
        if (err) { 
          return done(err);
        }

        assert(user.createdAt);
        assert(user.updatedAt);
        
        return done();
      });
    });

    it('should normalize undefined values to base values', function(done) {
      Semantic.User.create({ first_name: 'Yezy', last_name: undefined }, function(err, user) {
        if (err) { 
          return done(err);
        }

        assert.equal(user.last_name, '');
        
        return done();
      });
    });

    describe('overloaded usage of create', function() {
      var testName = '.create() test create a list';

      before(function(done) {
        var users = [];

        for(var i=0; i<4; i++) {
          users.push({ first_name: 'test_' + i, type: testName });
        }

        Semantic.User.create(users, done);
      });


      it('should have saved the proper values (with auto-increment values)', function(done) {
        Semantic.User.find({where : { type: testName }, sort : {first_name : 1}}, function(err, users) {
          if (err) {
            return done(err);
          }

          
          assert.equal(users.length, 4, 'Expecting 4 "users", but actually got '+users.length+': '+require('util').inspect(users, false, null));
          assert.equal(users[0].first_name, 'test_0' );
          
          return done();
        });
      });
    });
  });
});
