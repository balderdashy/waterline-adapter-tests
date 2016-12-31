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
  });
});
