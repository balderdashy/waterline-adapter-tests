var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.findOne()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Insert a record to find
    before(function(done) {
      Semantic.User.create({ first_name: 'findOne test'}, function(err, record) {
        if(err) return done(err);
        id = record.id;
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return a single record', function(done) {
      Semantic.User.findOne({ first_name: 'findOne test' }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOne test');
        done();
      });
    });

    it('should return a model instance', function(done) {
      Semantic.User.findOne({ first_name: 'findOne test' }, function(err, user) {
        assert(user.id);
        assert(typeof user.fullName === 'function');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

    it('should return null if a record is not found', function(done) {
      Semantic.User.findOne({ first_name: 'findOne blah' }, function(err, user) {
        assert(!err);
        assert(!user);
        done();
      });
    });

    it('should work with just an id passed in', function(done) {
      Semantic.User.findOne(id, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOne test');
        done();
      });
    });

  });
});
