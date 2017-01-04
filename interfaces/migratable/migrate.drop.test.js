/*
 * Module dependencies
 */

var assert = require('assert');
var _ = require('@sailshq/lodash');
var Waterline = require('waterline');
var waterlineUtils = require('waterline-utils');

describe('Migratable Interface', function() {
  describe('migrate: "drop"', function() {
    it('should have the proper migrate setting when bootstrapping', function() {
      assert.equal(Migratable.Drop.migrate, 'drop');
    });

    describe('teardown and drop existing data', function() {
      before(function(done) {
        Migratable.Drop.create({ name: 'blackbeard' }, done);
      });

      it('should not retain the data when bootstrapped the second time', function(done) {
        Migratable.Waterline.teardown(function(err) {
          // Create a new ORM instance
          var wl = new Waterline();

          // Load the fixtures again
          var fixtures = _.cloneDeep(Migratable.fixtures);
          _.each(fixtures, function(val, key) {
            wl.registerModel(Waterline.Collection.extend(fixtures[key]));
          });

          // Initialize the ORM again
          wl.initialize(Migratable.WaterlineOptions, function(err, orm) {
            if (err) {
              return done(err);
            }
 
            // Run migrations
            waterlineUtils.autoMigrations('drop', orm, function(err) {
              if (err) {
                return done(err);
              }

              orm.collections.drop.count().exec(function(err, numOfPirates) {
                if (err) {
                  return done(err);
                }

                assert.strictEqual(numOfPirates, 0);
                
                return done();
              });
            });
          });
        });
      });
    });
  });
});
