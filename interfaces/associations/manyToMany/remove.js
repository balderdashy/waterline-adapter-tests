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
    describe('association .remove()', function() {

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var driverRecord, taxiRecords;

        before(function(done) {

          Driver.create({ name: 'manymany remove' })
          .exec(function(err, model) {
            if(err) return done(err);

            driverRecord = model;

            var taxis = [];
            for(var i=0; i<2; i++) {
              driverRecord.taxis.add({ medallion: i });
            }

            driverRecord.save(function(err) {
              if(err) return done(err);

              Driver.findOne(driverRecord.id)
              .populate('taxis')
              .exec(function(err, driver) {
                if(err) return done(err);
                taxiRecords = driver.toObject().taxis;
                done();
              });
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should remove the record from the join table', function(done) {
          driverRecord.taxis.remove(taxiRecords[0].id);
          driverRecord.save(function(err) {
            if(err) return done(err);

            // Look up the driver again to be sure the taxi was removed
            Driver.findOne(driverRecord.id)
            .populate('taxis')
            .exec(function(err, data) {
              if(err) return done(err);

              assert(data.taxis.length === 1);
              done();
            });
          });
        });
      });

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var driverRecord;

        before(function(done) {
          Driver.create({ name: 'manymany remove' })
          .exec(function(err, model) {
            if(err) return done(err);
            driverRecord = model;
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should error when an object is passed in', function(done) {
          driverRecord.taxis.remove({ medallion: 1337 });
          driverRecord.save(function(err) {
            assert(err);
            assert(Array.isArray(err));
            assert(err.length === 1);
            assert(err[0].type === 'remove');

            done();
          });
        });
      });

    });
  });
});
