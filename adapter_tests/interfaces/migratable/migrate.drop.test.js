/*
 * Module dependencies
 */

var assert = require('assert'),
    bootstrapFn = require('./support/bootstrapFn');

describe('Migratable Interface', function() {

  describe('migrate: "drop"', function() {

    it('should have the proper migrate setting when bootstrapping', function() {
      assert(Migratable.Drop.migrate === 'drop');
    });

    it('should have tables', function(done) {
      Migratable.Drop.describe(function(err, schema) {
        assert(!err);
        assert(schema);
        done();
      });
    });

    describe('teardown and drop existing data', function() {

      before(function(done) {
        Migratable.Drop.create({ name: 'blackbeard' }, done);
      });

      it('should not retain the data when bootstrapped the second time', function(done) {
        Migratable.waterline.teardown(function(err) {
          bootstrapFn(function(err, obj) {

            var ontology = obj.ontology;

            ontology.collections.drop.count().exec(function(err, numOfPirates) {
              assert(!err);
              assert(numOfPirates === 0);
              done();
            });
          });
        });
      });
    });

  });
});
