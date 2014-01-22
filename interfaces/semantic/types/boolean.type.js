var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
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

  describe('Boolean Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper boolean value', function(done) {
        User.create({ status: true }, function(err, record) {
          assert(!err);
          assert(record.status === true);
          done();
        });
      });

    });
  });
});
