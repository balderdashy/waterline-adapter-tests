var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.queryable = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('SKIP Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'skip_user' + i, type: 'skip test'});
      }

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the correct amount of records', function(done) {
      User.find({ where: { type: 'skip test' }, skip: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 7);
        done();
      });
    });

    it('dynamic finder usage should return the correct amount of records', function(done) {
      User.findByType('skip test', { skip: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 7);
        done();
      });
    });

    it('as an option should return correct amount of records', function(done) {
      User.find({ where: { type: 'skip test' } }, { skip: 3 }, function(err, users) {
        assert(!err);
        assert(Array.isArray(users));
        assert(users.length === 7);
        done();
      });
    });

  });
});
