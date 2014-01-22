var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User, id, waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.semantic = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
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
