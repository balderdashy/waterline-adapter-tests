var Waterline = require('waterline'),
    taxiFixture = require('../support/manyToMany.taxi.fixture'),
    driverFixture = require('../support/manyToMany.driver.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Taxi, Driver, waterline;

  before(function(done) {
    waterline = new Waterline();

    waterline.loadCollection(taxiFixture);
    waterline.loadCollection(driverFixture);

    Events.emit('fixture', taxiFixture);
    Events.emit('fixture', driverFixture);

    Connections.associations = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);

      Taxi = colls.collections.taxi;
      Driver = colls.collections.driver;

      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });


  describe('Many To Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      Driver.create({ name: 'manymany find where'}, function(err, driver) {
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

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return only taxis with medallions less than 2', function(done) {
        Driver.find({ name: 'manymany find where' })
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
        Driver.find({ name: 'manymany find where' })
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
});
