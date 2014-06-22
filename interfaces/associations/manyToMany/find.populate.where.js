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
        assert(!err, err);

        assert(Array.isArray(drivers));
        assert(drivers.length === 1);
        assert(Array.isArray(drivers[0].taxis));
        assert(drivers[0].taxis.length === 2, 'Expected first driver to have 2 taxis, but got '+drivers[0].taxis.length+', see?\n'+require('util').inspect(drivers[0]) );

        done();
      });
    });

    it('should return taxis using skip and limit', function(done) {
      Associations.Driver.find({ name: 'manymany find where' })
      .populate('taxis', { skip: 1, limit: 2 })
      .exec(function(err, drivers) {
        assert(!err);

        assert(Array.isArray(drivers));
        assert(drivers.length === 1);

        assert(Array.isArray(drivers[0].taxis));

        assert(drivers[0].taxis.length === 2, 'Expected first driver to have 2 taxis, but got '+drivers[0].taxis.length+', see?\n'+require('util').inspect(drivers[0]));
        assert(drivers[0].taxis[0].medallion === 1, 'Expected first driver\'s first taxi to have medallion===1, but heres what I got for the first driver: '+require('util').inspect(drivers[0], false, null));
        assert(drivers[0].taxis[1].medallion === 2, 'Expected first driver\'s second taxi to have medallion===2, but heres what I got for the first driver: '+require('util').inspect(drivers[0], false, null));

        done();
      });
    });

  });
});
