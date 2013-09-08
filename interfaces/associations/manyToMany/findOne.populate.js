var Waterline = require('waterline'),
    taxiFixture = require('../support/manyToMany.taxi.fixture'),
    driverFixture = require('../support/manyToMany.driver.fixture'),
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Taxi, Driver;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(taxiFixture);
    waterline.loadCollection(driverFixture);

    Events.emit('fixture', taxiFixture);
    Events.emit('fixture', driverFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Taxi = collections.taxi;
      Driver = collections.driver;

      done();
    });
  });


  describe('Many To Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      Driver.create({ name: 'manymany findOne'}, function(err, driver) {
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

    describe('.findOne', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return taxis when the populate criteria is added', function(done) {
        Driver.findOne(driverRecord.id)
        .populate('taxis')
        .exec(function(err, driver) {
          if(err) return done();

          assert(Array.isArray(driver.taxis));
          assert(driver.taxis.length === 2);

          done();
        });
      });

      it('should not return a taxis object when the populate is not added', function(done) {
        Driver.findOne(driverRecord.id)
        .exec(function(err, driver) {
          if(err) return done(err);

          var obj = driver.toJSON();
          assert(!obj.taxis);

          done();
        });
      });

    });
  });
});
