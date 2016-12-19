var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('n:m association :: .find().populate([WHERE])', function() {
    var driverRecord;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany find where'}, function(err, driver) {
        if (err) {
          return done(err);
        }

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<4; i++) {
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

    it('should return only taxis with medallions less than 2', function(done) {
      Associations.Driver.find({ name: 'manymany find where' })
      .populate('taxis', { medallion: { '<': 2 }})
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

    it('should return taxis using skip and limit', function(done) {
      Associations.Driver.find({ name: 'manymany find where' })
      .populate('taxis', { skip: 1, limit: 2, sort: 'medallion ASC' })
      .exec(function(err, drivers) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(drivers));
        assert.equal(drivers.length, 1);

        assert(_.isArray(drivers[0].taxis));

        assert.equal(drivers[0].taxis.length, 2);
        assert.equal(drivers[0].taxis[0].medallion, 1);
        assert.equal(drivers[0].taxis[1].medallion, 2);

        return done();
      });
    });
  });
});
