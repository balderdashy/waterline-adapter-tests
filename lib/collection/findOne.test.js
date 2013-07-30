var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Collection', function() {
  var User, id;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.findOne()', function() {

    // Insert a record to find
    before(function(done) {
      User.create({ first_name: 'findOne test'}, function(err, record) {
        if(err) return done(err);
        id = record.id;
        done();
      });
    });

    it('should return a single record', function(done) {
      User.findOne({ first_name: 'findOne test' }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOne test');
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.findOne({ first_name: 'findOne test' }, function(err, user) {
        assert(user.id);
        assert(typeof user.fullName === 'function');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

    it('should return null if a record is not found', function(done) {
      User.findOne({ first_name: 'findOne blah' }, function(err, user) {
        assert(!err);
        assert(!user);
        done();
      });
    });

    it('should work with just an id passed in', function(done) {
      User.findOne(id, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOne test');
        done();
      });
    });

  });
});
