var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .update()', function() {
    describe('update nested associations()', function() {

      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Driver;

          before(function(done) {

            Associations.Driver.create({ name: 'm:m update nested' }).exec(function(err, driver) {
              if(err) return done(err);
              Driver = driver;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new taxi and associate it with a driver', function(done) {

            var taxiData = {
              name: 'm:m update nested - updated',
              taxis: [
                { medallion: 1 }
              ]
            };

            Associations.Driver.update({ id: Driver.id }, taxiData).exec(function(err, values) {
              assert(!err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis')
              .exec(function(err, model) {
                assert(!err);
                assert(model.name === 'm:m update nested - updated');
                assert(model.taxis.length === 1);
                assert(model.taxis[0].medallion === 1);
                done();
              });

            });
          });
        });


        describe('when associations already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Driver;

          before(function(done) {

            var data = {
              name: 'm:m update nested',
              taxis: [
                { medallion: 1 },
                { medallion: 2 }
              ]
            };

            Associations.Driver.create(data).exec(function(err, driver) {
              if(err) return done(err);
              Driver = driver;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var taxiData = {
              name: 'm:m update nested - updated',
              taxis: [
                { medallion: 3 },
                { medallion: 4 },
                { medallion: 5 }
              ]
            };

            Associations.Driver.update({ id: Driver.id }, taxiData).exec(function(err, values) {
              assert(!err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis')
              .exec(function(err, model) {
                assert(!err);
                assert(model.name === 'm:m update nested - updated');
                assert(model.taxis.length === 3);
                assert(model.taxis[0].medallion === 3);
                assert(model.taxis[1].medallion === 4);
                assert(model.taxis[2].medallion === 5);
                done();
              });

            });
          });
        });

        describe('when associations have primary keys', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Driver, Taxis;

          before(function(done) {

            var taxiData = [
              { medallion: 1 },
              { medallion: 2 }
            ];

            var data = {
              name: 'm:m update nested',
              taxis: [
                { medallion: 100 },
                { medallion: 200 }
              ]
            };

            Associations.Taxi.create(taxiData).exec(function(err, taxis) {
              if(err) return done(err);
              Taxis = taxis;

              Associations.Driver.create(data).exec(function(err, driver) {
                if(err) return done(err);
                Driver = driver;
                done();
              });
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values', function(done) {

            var taxiData = {
              name: 'm:m update nested - updated',
              taxis: Taxis.map(function(taxi) { return taxi.toObject(); })
            };

            Associations.Driver.update({ id: Driver.id }, taxiData).exec(function(err, values) {
              assert(!err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis')
              .exec(function(err, model) {
                assert(!err);
                assert(model.name === 'm:m update nested - updated');
                assert(model.taxis.length === 2);

                // Ensure association values were updated
                assert(model.taxis[0].medallion === 1);
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
