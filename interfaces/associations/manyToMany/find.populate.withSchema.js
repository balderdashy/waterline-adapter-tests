var assert = require('assert');
var _ = require('@sailshq/lodash');

if (adapterFeatures.indexOf('schemas') > -1) {
  describe('Association Interface (with schemas)', function() {
    describe('n:m association :: .find().populate()', function() {
      var driverRecord;

      before(function(done) {
        Associations.Driverwithschema.create({ name: 'manymany find'}, function(err, driver) {
          if (err) {
            return done(err);
          }

          driverRecord = driver;

          var taxis = [];
          for(var i=0; i<2; i++) {
            taxis.push({ medallion: i });
          }

          Associations.Taxiwithschema.createEach(taxis, function(err, taxis) {
            if (err) {
              return done(err);
            }

            var childrenIds = _.map(taxis, function(taxi) {
              return taxi.id;
            });

            Associations.Driverwithschema.addToCollection(driver.id, 'taxis', childrenIds)
            .exec(function(err) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it('should return taxis when the populate criteria is added', function(done) {
        Associations.Driverwithschema.find({ name: 'manymany find' })
        .populate('taxis')
        .exec(function(err, drivers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(drivers));
          assert.equal(drivers.length, 1);
          assert(_.isArray(drivers[0].taxis));
          assert.equal(drivers[0].taxis.length, 2);

          return done();
        });
      });

      it('should not return a taxis object when the populate is not added', function(done) {
        Associations.Driverwithschema.find()
        .exec(function(err, drivers) {
          if (err) {
            return done(err);
          }

          assert(!drivers[0].taxis);

          return done();
        });
      });
    });
  });
}