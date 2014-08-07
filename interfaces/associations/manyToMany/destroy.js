var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .destroy()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany destroy'}, function(err, driver) {
        if(err) return done(err);

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<2; i++) {
          driverRecord.taxis.add({ medallion: i });
        }

        driverRecord.save(function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should remove join table records when a parent is destroyed', function(done) {

      var parentId = driverRecord.id;

      Associations.Driver.destroy({ name: 'manymany destroy' })
      .exec(function(err, status) {
        assert(!err);

        Associations.Driver_taxis__taxi_drivers.find({ driver_taxis: parentId })
        .exec(function(err, records) {
          assert(!err);
          assert(records.length === 0);
          done();
        });
      });
    });

  });

  describe('destroying an entire collection', function () {

    it('should not result in an error', function (done) {
      Associations.Driver.destroy(function (err, status) {
        assert(!err);
        done();
      });
    });
  });

  describe('destroying an entire collection, now empty', function () {

    it('should not result in an error', function (done) {
      Associations.Driver.destroy(function (err, status) {
        assert(!err);
        done();
      });
    });
  });

});
