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

  describe('.create()', function() {

    it('should create a new record', function(done) {
      User.create({ first_name: "Foo" }, function(err, record) {
        assert(!err);
        assert(record.first_name === 'Foo');
        done();
      });
    });

    it('should return a generated PK', function(done) {
      User.create({ first_name: "FooBar" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'FooBar');
        assert(user.id);
        done();
      });
    });

    it('should return generated timestamps', function(done) {
      User.create({ first_name: "Foo", last_name: 'Bar' }, function(err, user) {
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.create({ first_name: "Foo", last_name: 'Bar' }, function(err, user) {
        assert(user.fullName() === 'Foo Bar');
        done();
      });
    });

    describe('overloaded usage of create', function() {

      var testName = '.create() test create a list';

      before(function(done) {
        var users = [];

        for(var i=0; i<4; i++) {
          users.push({ first_name: 'test_' + i, type: testName });
        }

        User.create(users, done);
      });

      it('should have saved the proper values (with auto-increment values)', function(done) {
        User.findAll({ type: testName }, function(err, users) {
          assert(!err);
          assert(users.length === 4);
          assert(users[0].first_name === 'test_0' );
          done();
        });
      });
    });

  });
});
