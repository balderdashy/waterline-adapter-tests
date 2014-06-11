var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .add()', function() {

    describe('with an object', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var driverRecord;

      before(function(done) {
        Associations.Driver.create({ name: 'manymany add' })
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
          assert(!err, err);


          // Look up the customer again to be sure the payment was added
          Associations.Driver.findOne(driverRecord.id)
          .populate('taxis')
          .exec(function(err, driver) {
            assert(!err);

            assert(driver.taxis.length === 1, 'Expected driver to have one taxi, but actually there are '+driver.taxis.length+', see? `driver.taxi` =>'+require('util').inspect(driver.taxis,false,null));
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
        Associations.Driver.create({ name: 'manymany add' })
        .exec(function(err, model) {
          if(err) return done(err);
          driverRecord = model;

          Associations.Taxi.create({ medallion: 20 })
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
          assert(!err);

          // Look up the driver again to be sure the taxi was added
          Associations.Driver.findOne(driverRecord.id)
          .populate('taxis')
          .exec(function(err, data) {
            assert(!err);

            assert(data.taxis.length === 1);
            assert(data.taxis[0].medallion === 20);
            done();
          });
        });
      });

      it('should error if the associated record doesn\'t exist', function(done) {
        driverRecord.taxis.add(taxiRecord.id + 1);
        driverRecord.save(function(err) {
          assert(err);
          assert(Array.isArray(err));
          assert(err.length === 1);
          done();
        });
      });
    });

  });
});
