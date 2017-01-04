var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('n:m association :: .find().populate([WHERE])', function() {
    var driverRecords;

    before(function(done) {
      Associations.Driver.createEach([{ name: 'manymany find where1'}, { name: 'manymany find where2'}], function(err, drivers) {
        if (err) {
          return done(err);
        }

        driverRecords = drivers;

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

          Associations.Driver.addToCollection([drivers[0].id, drivers[1].id], 'taxis', childrenIds)
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
      Associations.Driver.find({ name: 'manymany find where1' })
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
      Associations.Driver.find({ name: ['manymany find where1', 'manymany find where2'] })
      .populate('taxis', { skip: 1, limit: 2, sort: 'medallion ASC' })
      .exec(function(err, drivers) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(drivers));
        assert.equal(drivers.length, 2);

        assert(_.isArray(drivers[0].taxis));

        assert.equal(drivers[0].taxis.length, 2);
        assert.equal(drivers[0].taxis[0].medallion, 1);
        assert.equal(drivers[0].taxis[1].medallion, 2);

        assert(_.isArray(drivers[1].taxis));

        assert.equal(drivers[1].taxis.length, 2);
        assert.equal(drivers[1].taxis[0].medallion, 1);
        assert.equal(drivers[1].taxis[1].medallion, 2);

        return done();
      });
    });
  });
});
