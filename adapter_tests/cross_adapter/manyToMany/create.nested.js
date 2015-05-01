var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .add()', function() {
    describe('create nested associations()', function() {

      describe('with single level depth', function() {

        describe('and objects', function() {

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxis and associate them', function(done) {

            var data = {
              name: 'many to many nested',
              taxis: [
                { medallion: 1 },
                { medallion: 2 }
              ]
            };

            Associations.Driver.create(data).exec(function(err, values) {
              assert(!err);

              // Look up the customer again to be sure the payments were added
              Associations.Driver.findOne(values.id)
              .populate('taxis')
              .exec(function(err, model) {
                assert(!err);
                assert(model.taxis.length === 2);
                assert(model.taxis[1].medallion === 2);
                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var taxiId;

          before(function(done) {
            Associations.Taxi.create({ medallion: 1337 }).exec(function(err, taxi) {
              if(err) return done(err);
              taxiId = taxi.id;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxi associations', function(done) {

            var data = {
              name: 'many to many nested',
              taxis: [
                taxiId,
                { medallion: 2 }
              ]
            };

            Associations.Driver.create(data).exec(function(err, values) {
              assert(!err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values.id)
              .populate('taxis')
              .exec(function(err, model) {
                assert(!err);
                assert(model.taxis.length === 2);
                assert(model.taxis[1].medallion === 2);
                done();
              });

            });
          });
        });

      });
    });
  });
});
