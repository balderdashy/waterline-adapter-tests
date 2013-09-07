var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User, id;

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

  describe('.findOne()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Insert a record to find
    before(function(done) {
      User.create({ first_name: 'findOne test'}, function(err, record) {
        if(err) return done(err);
        id = record.id;
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

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
