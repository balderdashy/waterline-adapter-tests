var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('n:m association :: .add()', function() {
    describe('create nested associations when a custom primary key is set', function() {

      describe('with single level depth', function() {

        describe('and objects', function() {

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxis and associate them', function(done) {

            var data = {
              number: 101,
              name: 'many to many nested',
              taxis: [
                { vin: 'a001', medallion: 1 },
                { vin: 'a002', medallion: 2 }
              ]
            };

            Associations.Drivercustom.create(data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Drivercustom.findOne(values.number)
              .populate('taxis',{sort : {medallion : 1}})
              .exec(function(err, model) {
                assert.ifError(err);

                assert.equal(model.taxis.length, 2);

                assert.equal(model.taxis[0].vin, 'a001');
                assert.equal(model.taxis[0].medallion, 1);

                assert.equal(model.taxis[1].vin, 'a002');
                assert.equal(model.taxis[1].medallion, 2);

                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {
          var taxiId;

          before(function(done) {
            Associations.Taxicustom.create({ vin: 'a003', medallion: 1337 }).exec(function(err, taxi) {
              if(err) return done(err);
              taxiId = taxi.vin;
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new driver and taxi associations', function(done) {

            var data = {
              number: 200,
              name: 'many to many nested',
              taxis: [
                taxiId,
                { vin: 'a004', medallion: 2 }
              ]
            };

            Associations.Drivercustom.create(data).exec(function(err, values) {

              assert.ifError(err);

              // Look up the driver again to be sure the taxis were added
              Associations.Drivercustom.findOne(values.number)
              .populate('taxis')
              .exec(function(err, model) {
                assert.ifError(err);

                assert.equal(model.taxis[0].vin, 'a003');
                assert.equal(model.taxis[0].medallion, 1337);

                assert.equal(model.taxis[1].vin, 'a004');
                assert.equal(model.taxis[1].medallion, 2);

                done();
              });

            });
          });
        });

      });
    });
  });
});
