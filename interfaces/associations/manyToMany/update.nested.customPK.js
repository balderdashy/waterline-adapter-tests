var assert = require('assert');
var Promise = require('bluebird');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .update()', function() {
    describe('update nested associations() when a custom primary key is used', function() {

      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Driver;

          before(function(done) {

            Associations.Drivercustom.create({ number: 1000, name: 'm:m update nested' }).exec(function(err, driver) {
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
                { vin: 'b001', medallion: 1 }
              ]
            };

            Associations.Drivercustom.update({ number: Driver.number }, taxiData).exec(function(err, values) {
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Drivercustom.findOne(values[0].number)
              .populate('taxis')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, 'm:m update nested - updated');
                assert.equal(model.taxis.length, 1);

                assert.equal(model.taxis[0].vin, 'b001');
                assert.equal(model.taxis[0].medallion, 1);

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
              number: 2000,
              name: 'm:m update nested',
              taxis: [
                { vin: 'b003', medallion: 1 },
                { vin: 'b004', medallion: 2 }
              ]
            };

            Associations.Drivercustom.create(data).exec(function(err, driver) {
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
                { vin: 'b005', medallion: 3 },
                { vin: 'b006', medallion: 4 },
                { vin: 'b007', medallion: 5 }
              ]
            };

            Associations.Drivercustom.update({ number: Driver.number }, taxiData).exec(function(err, values) {
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Drivercustom.findOne(values[0].number)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert(!err, 'Error: ' + err);

                assert.equal(model.name, 'm:m update nested - updated');
                assert.equal(model.taxis.length, 3);

                assert.equal(model.taxis[0].vin, 'b005');
                assert.equal(model.taxis[0].medallion, 3);

                assert.equal(model.taxis[1].vin, 'b006');
                assert.equal(model.taxis[1].medallion, 4);

                assert.equal(model.taxis[2].vin, 'b007');
                assert.equal(model.taxis[2].medallion, 5);

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
              { vin: 'b008', medallion: 1 },
              { vin: 'b009', medallion: 2 }
            ];

            var data = {
              number: 600,
              name: 'm:m update nested',
              taxis: [
                { vin: 'b010', medallion: 100 },
                { vin: 'b011', medallion: 200 }
              ]
            };

            Associations.Taxicustom.create(taxiData).exec(function(err, taxis) {
              if(err) return done(err);
              Taxis = taxis;

              Associations.Drivercustom.create(data).exec(function(err, driver) {
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
              taxis: Taxis.map(function(taxi) { return taxi.vin; })
            };

            Associations.Drivercustom.update({ number: Driver.number }, taxiData).exec(function(err, values) {
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Drivercustom.findOne(values[0].number)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, 'm:m update nested - updated');
                assert.equal(model.taxis.length, 2);

                // Ensure association values were updated
                assert.equal(model.taxis[0].vin, 'b008');
                assert.equal(model.taxis[0].medallion, 1);

                assert.equal(model.taxis[1].vin, 'b009');
                assert.equal(model.taxis[1].medallion, 2);

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
              number: 700,
              name: 'm:m update nested save',
              taxis: [ { vin: 'b012', medallion: 1000 } ]
            };

            Associations.Drivercustom.create(data).exec(function(err, driver) {
              if(err) return done(err);
              Driver = driver;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values with save()', function(done) {

            Associations.Drivercustom.findOne({ number: Driver.number })
            .populate('taxis')
            .exec(function(err, model) {
              var taxi = model.taxis[0];
              taxi.medallion = 1001;
              taxi.save(function(err){
                assert.ifError(err);

                Associations.Drivercustom.findOne({ number: Driver.number })
                .populate('taxis')
                .exec(function(err, model) {
                  assert.ifError(err);
                  assert.equal(model.taxis.length, 1);
                  assert.equal(model.taxis[0].vin, 'b012');
                  assert.equal(model.taxis[0].medallion, 1001);
                  done();
                });
              });

            });
          });
        });


        describe('when associations are sync\'ed rapidly', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Drivers;
          var Taxis;

          before(function(done) {

            var driversData = [
              {number: 8, name: "Rapid 0"},
              {number: 9, name: "Rapid 1"},
              {number: 10, name: "Rapid 2"},
              {number: 11, name: "Rapid 3"}
            ];

            var taxisData = [
              {vin: 'b013', medallion: 200},
              {vin: 'b014', medallion: 201},
              {vin: 'b015', medallion: 202},
              {vin: 'b016', medallion: 203}
            ];

            Associations.Drivercustom.createEach(driversData).exec(function(err, drivers) {
              if(err) return done(err);
              Drivers = drivers;

              Associations.Taxicustom.createEach(taxisData).exec(function(err, taxis) {
                if(err) return done(err);
                Taxis = taxis;

                done();
              });

            });

          });

        });

      });
    });
  });
});
