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

  describe('.findOrCreateEach()', function() {

    var testName = 'findOrCreateEach([])';
    var testData = [{
      first_name: 'marge',
      type: testName
    }, {
      first_name: 'richie',
      type: testName
    }, {
      first_name: Math.round(Math.random() * 10000),
      type: testName
    }, {
      first_name: Math.round(Math.random() * 10000),
      type: testName
    }, {
      first_name: Math.round(Math.random() * 10000),
      type: testName
    }, {
      first_name: Math.round(Math.random() * 10000),
      type: testName
    }];

    before(function(done) {
      User.create(testData, done);
    });

    it('should create new user(s) for the one that doesn\'t exist', function(done) {
      User.findOrCreateEach(['type', 'first_name'], [{
        first_name: 'NOT IN THE SET',
        type: testName
      }], function(err, results) {
        assert(!err);
        assert(results.length === 1);
        done();
      });
    });

    it('should find a user that does exist', function(done) {
      User.findOrCreateEach(['type', 'first_name'], [{
        first_name: 'NOT IN THE SET',
        type: testName
      }], function(err, results) {
        assert(!err);
        assert(results.length === 1);
        done();
      });
    });

    it('should only have a single record for keys that exist', function(done) {
      User.findAll({ first_name: 'NOT IN THE SET' }, function(err, users) {
        assert(users.length === 1);
        done();
      });
    });

    it('should fail when only one arg is specified', function(done) {
      User.findOrCreateEach(testData, function(err) {
        assert(err);
        done();
      });
    });

    it('should return model instances', function(done) {
      User.findOrCreateEach(['type', 'first_name'], [{ first_name: 'NOT IN THE SET' }], function(err, users) {
        assert(users[0].id);
        assert(typeof users[0].fullName === 'function');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
