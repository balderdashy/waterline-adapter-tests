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
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var driverRecord;

        before(function(done) {
          Driver.create({ name: 'manymany add' })
          .exec(function(err, model) {
            if(err) return done(err);
             driverRecord = model;
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new taxi association', function(done) {
          driverRecord.taxis.add({ medallion: 1 });
          driverRecord.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            Driver.findOne(driverRecord.id)
            .populate('taxis')
            .exec(function(err, driver) {
              if(err) return done(err);

              assert(driver.taxis.length === 1);
              assert(driver.taxis[0].medallion === 1);

              done();
            });
          });
        });
      });

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var driverRecord, taxiRecord;

        before(function(done) {
          Driver.create({ name: 'manymany add' })
          .exec(function(err, model) {
            if(err) return done(err);
            driverRecord = model;

            Taxi.create({ medallion: 20 })
            .exec(function(err, taxi) {
              if(err) return done(err);
              taxiRecord = taxi;
              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should link a payment to a customer through a join table', function(done) {
          driverRecord.taxis.add(taxiRecord.id);
          driverRecord.save(function(err) {
            if(err) return done(err);

            // Look up the driver again to be sure the taxi was added
            Driver.findOne(driverRecord.id)
            .populate('taxis')
            .exec(function(err, data) {
              if(err) return done(err);

              assert(data.taxis.length === 1);
              assert(data.taxis[0].medallion === 20);
              done();
            });
          });
        });
      });

    });
  });
});
