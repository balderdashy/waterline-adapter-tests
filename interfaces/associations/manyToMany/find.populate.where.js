var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .find().populate([WHERE])', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany find where'}, function(err, driver) {
        if(err) return done(err);

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<4; i++) {
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

    it('should return only taxis with medallions less than 2', function(done) {
      Associations.Driver.find({ name: 'manymany find where' })
      .populate('taxis', { medallion: { '<': 2 }})
      .exec(function(err, drivers) {
        if(err) return done();

        assert(Array.isArray(drivers));
        assert(drivers.length === 1);
        assert(Array.isArray(drivers[0].taxis));
        assert(drivers[0].taxis.length === 2);

        done();
      });
    });

    it('should return taxis using skip and limit', function(done) {
      Associations.Driver.find({ name: 'manymany find where' })
      .populate('taxis', { skip: 1, limit: 2 })
      .exec(function(err, drivers) {
        if(err) return done(err);

        assert(Array.isArray(drivers));
        assert(drivers.length === 1);

        assert(Array.isArray(drivers[0].taxis));

        assert(drivers[0].taxis.length === 2);
        assert(drivers[0].taxis[0].medallion === 1);
        assert(drivers[0].taxis[1].medallion === 2);

        done();
      });
    });

  });
});
