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

  describe('Date Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper date value', function(done) {
        var date = new Date();
        User.create({ dob: date }, function(err, record) {
          assert(!err);

          // Convert both dates to unix timestamps
          var origDate = Date.parse(date);
          var resultDate = Date.parse(new Date(record.dob));

          assert(origDate === resultDate);
          done();
        });
      });

    });
  });
});
