var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Many to Many Association', function() {
    describe('projections', function() {
      var driverRecord;

      before(function(done) {
        Associations.Driver.create({ name: 'manymany findOne'}, function(err, driver) {
          if (err) {
            return done(err);
          }

          driverRecord = driver;

          var taxis = [];
          // for(var i=0; i<2; i++) {
          taxis.push({ model: 'sedan', medallion: 101 });
          // }

          Associations.Taxi.createEach(taxis, function(err, taxis) {
            if (err) {
              return done(err);
            }

            var childrenIds = _.map(taxis, function(taxi) {
              return taxi.id;
            });

            Associations.Driver.addToCollection(driver.id, 'taxis', childrenIds)
            .exec(function(err) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it('should filter populated attributes when projections are used', function(done) {
        Associations.Driver.findOne({ id: driverRecord.id })
        .populate('taxis', { select: ['model'] })
        .exec(function(err, driver) {
          if (err) {
            return done(err);
          }

          assert(driver);
          assert(_.isArray(driver.taxis));
          assert.equal(driver.taxis.length, 1);

          assert.equal(_.keys(driver.taxis[0]).length, 2);
          assert(driver.taxis[0].id);
          assert.equal(driver.taxis[0].model, 'sedan');
          
          return done();
        });
      });
    });
  });
});
