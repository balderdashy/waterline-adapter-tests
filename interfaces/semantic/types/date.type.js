var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
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
