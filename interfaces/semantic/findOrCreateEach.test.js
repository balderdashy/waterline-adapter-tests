var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

  describe('.findOrCreateEach()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var testName = 'findOrCreateEach([])';

    before(function(done) {
      var users = [];

      for(var i=0; i<4; i++) {
        users.push({ first_name: 'findOrCreate_' + i, type: testName });
      }

      User.create(users, done);
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

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
      User.find({ first_name: 'NOT IN THE SET' }, function(err, users) {
        assert(users.length === 1);
        done();
      });
    });

    it('should fail when only one arg is specified', function(done) {
      User.findOrCreateEach([], function(err) {
        assert(err);
        done();
      });
    });

    it('should return model instances', function(done) {
      User.findOrCreateEach(['type', 'first_name'], [{ type: testName, first_name: 'NOT IN THE SET' }], function(err, users) {
        assert(!err);
        assert(users[0].id);
        assert(typeof users[0].fullName === 'function');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
