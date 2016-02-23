var assert = require('assert'),
    Promise = require('bluebird'),
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
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, 'm:m update nested - updated');
                assert.strictEqual(model.taxis.length, 1);
                assert.strictEqual(model.taxis[0].medallion, 1);
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
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert(!err, 'Error: ' + err);
                assert.equal(model.name, 'm:m update nested - updated');
                assert.strictEqual(model.taxis.length, 3);
                assert.strictEqual(model.taxis[0].medallion, 3);
                assert.strictEqual(model.taxis[1].medallion, 4);
                assert.strictEqual(model.taxis[2].medallion, 5);
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
              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Driver.findOne(values[0].id)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, 'm:m update nested - updated');
                assert.strictEqual(model.taxis.length, 2);

                // Ensure association values were updated
                assert.strictEqual(model.taxis[0].medallion, 1);
                assert.strictEqual(model.taxis[1].medallion, 2);

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
              name: 'm:m update nested save',
              taxis: [ { medallion: 1000 } ]
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

          it('should update association values with save()', function(done) {
            
            Associations.Driver.findOne({ id: Driver.id })
            .populate('taxis')
            .exec(function(err, model) {
              var taxi = model.taxis[0];
              taxi.medallion = 1001;
              taxi.save(function(err){
                assert.ifError(err);
                
                Associations.Driver.findOne({ id: Driver.id })
                .populate('taxis')
                .exec(function(err, model) {
                  assert.ifError(err);
                  assert.strictEqual(model.taxis.length, 1);
                  assert.strictEqual(model.taxis[0].medallion, 1001);
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
              {name: "Rapid 0"},
              {name: "Rapid 1"},
              {name: "Rapid 2"},
              {name: "Rapid 3"}
            ];

            var taxisData = [
              {medallion: 200},
              {medallion: 201},
              {medallion: 202},
              {medallion: 203}
            ];
            
            Associations.Driver.createEach(driversData).exec(function(err, drivers) {
              if(err) return done(err);
              Drivers = drivers;
              
              Associations.Taxi.createEach(taxisData).exec(function(err, taxis) {
                if(err) return done(err);
                Taxis = taxis;
                
                done();
              });
              
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create the correct associations', function(done) {
            
            // Construct promises
            var associationMap = {};
            var associationPromises = [];
            
            var driverId, taxiId;
            for (var i = 0, il = Drivers.length; i < il; ++i) {
              
              driverId = _.findWhere(Drivers, {name: "Rapid " + i}).id;
              taxiId   = _.findWhere(Taxis,   {medallion: 200 + i}).id;
              
              // Set map for testing later.  Maps driver to taxi being associated.
              associationMap[driverId] = taxiId;
              
              associationPromises.push(
                Associations.Driver.update(driverId, {taxis: [{id: taxiId}]})
              );
            }
            
            // Perform all updates at once
            Promise.all(associationPromises)
            .then(function(results){
            
              // Check to see if associations were created as expected
              Associations.Driver.find({id: _.map(Drivers, 'id')})
              .populate('taxis')
              .exec(function(err, drivers) {
                
                if (err) return done(err);
                
                assert.equal(drivers.length, Drivers.length);
                
                // Ensure the correct operations happened per record using associationMap
                var driver;
                for (var i = 0, il = drivers.length; i < il; ++i) {
                  
                  driver = drivers[i];
                  
                  assert(typeof driver === "object" && driver !== null);
                  assert(Array.isArray(driver.taxis));
                  assert.equal(driver.taxis.length, 1);
                  assert.equal(driver.taxis[0].id, associationMap[driver.id]);
                }
                
                done();
                
              });
              
            })
            .catch(done);
            
          });
        });
        
      });
    });
  });
});
