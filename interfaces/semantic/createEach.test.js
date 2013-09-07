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

  describe('.createEach()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a set of users', function(done) {
      var usersArray = [
        { first_name: 'createEach_1', type: 'createEach' },
        { first_name: 'createEach_2', type: 'createEach' }
      ];

      User.createEach(usersArray, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 2);
        done();
      });
    });

    it('should insert 2 records verififed by find', function(done) {
      User.find({ type: 'createEach' }, function(err, users) {
        assert(!err);
        assert(users.length === 2);
        done();
      });
    });

    it('should return model instances', function(done) {
      var usersArray = [
        { first_name: 'createEach_3', type: 'createEach' },
        { first_name: 'createEach_4', type: 'createEach' }
      ];

      User.createEach(usersArray, function(err, users) {
        assert(users[0].id);
        assert(typeof users[0].fullName === 'function');
        assert(toString.call(users[0].createdAt) == '[object Date]');
        assert(toString.call(users[0].updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
