var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('n:m association :: .find().populate([WHERE])', function() {
    var driverRecords;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany find where populate nested'}, function(err, driver) {
        if (err) {
          return done(err);
        }

        var taxis = [];
        // { medallion: 1, model: 'odd', note: 'low' },
        // { medallion: 2, model: 'even', note: 'low' },
        // { medallion: 3, model: 'odd', note: 'low' },
        // { medallion: 4, model: 'even', note: 'low' },
        // { medallion: 5, model: 'odd', note: 'high' },
        // { medallion: 6, model: 'even', note: 'high' },
        // { medallion: 7, model: 'odd', note: 'high' },
        // { medallion: 8, model: 'even', note: 'high' },

        for(var i=1; i<=8; i++) {
          taxis.push({
            medallion: i,
            note: i <= 4 ? 'low' : 'high',
            model: i % 2 ? 'odd' : 'even'
          });
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


    it('should return the correct taxis', function(done) {
      Associations.Driver.find({ name: 'manymany find where populate nested' })
      .populate('taxis', { 
        where: { 
          or: [
            { 
              and: [
                { note: 'low' },
                { or: 
                  [
                    { medallion: { '>=': 2 } },
                    { model: 'even' }
                  ]
                }
              ]
            }, 
            { 
              and: [
                { note: 'high' },
                {
                  or: [
                    { model: { startsWith: 'o' } },
                    { medallion: 6 }
                  ]
                }
              ]
            }
          ]
        },
        sort: 'medallion desc'
      })
      .sort([{name: 'desc'}])
      .exec(function(err, drivers) {
        if (err) {
          return done(err);
        }
        var driver = drivers[0];
        assert(driver);
        assert(_.isArray(driver.taxis));
        assert.equal(driver.taxis.length, 6);

        // Expected results:
        // { medallion: 2, model: 'even', note: 'low' },
        // { medallion: 3, model: 'odd', note: 'low' },
        // { medallion: 4, model: 'even', note: 'low' },
        // { medallion: 5, model: 'odd', note: 'high' },
        // { medallion: 6, model: 'even', note: 'high' },
        // { medallion: 7, model: 'odd', note: 'high' },
        assert.equal(driver.taxis[0].medallion, 7);
        assert.equal(driver.taxis[1].medallion, 6);
        assert.equal(driver.taxis[2].medallion, 5);
        assert.equal(driver.taxis[3].medallion, 4);
        assert.equal(driver.taxis[4].medallion, 3);
        assert.equal(driver.taxis[5].medallion, 2);


        return done();
      });
    });

  });
});
