var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

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

  describe('.findOrCreate()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should return a single record', function(done) {
      User.findOrCreate({ first_name: "findOrCreate()" }, { first_name: "findOrCreate()" }, function(err, user) {
        assert(!err);
        assert(user.first_name === 'findOrCreate()');
        done();
      });
    });

    it('should only have a single record in the database', function(done) {
      User.find({ first_name: 'findOrCreate()' }, function(err, users) {
        assert(!err);
        assert(users.length === 1);
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.findOrCreate({ first_name: "model findOrCreate()" }, { first_name: "model findOrCreate()", last_name: 'test' }, function(err, user) {
        assert(user.id);
        assert(user.fullName() === 'model findOrCreate() test');
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

  });
});
