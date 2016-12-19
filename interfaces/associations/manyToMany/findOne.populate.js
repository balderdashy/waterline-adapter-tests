var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('n:m association :: .findOne().populate()', function() {
    var driverRecord;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany findOne'}, function(err, driver) {
        if (err) {
          return done(err);
        }

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<2; i++) {
          taxis.push({ medallion: i });
        }

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

    it('should return taxis when the populate criteria is added', function(done) {
      Associations.Driver.findOne(driverRecord.id)
      .populate('taxis')
      .exec(function(err, driver) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(driver.taxis));
        assert.equal(driver.taxis.length, 2);

        return done();
      });
    });

    it('should not return a taxis object when the populate is not added', function(done) {
      Associations.Driver.findOne(driverRecord.id)
      .exec(function(err, driver) {
        if (err) {
          return done(err);
        }

        assert(!driver.taxis);

        return done();
      });
    });
  });
});
