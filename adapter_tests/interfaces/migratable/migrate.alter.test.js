/*
 * Module dependencies
 */

var assert = require('assert'),
    bootstrapFn = require('./support/bootstrapFn');

describe('Migratable Interface', function() {

  describe('migrate: "alter"', function() {
    runTests("Alter");
  });

  describe('migrate: "alter" with custom table and column names', function() {
    runTests("Custom");
  });

  function runTests(collectionName) {

      it('should have the proper migrate setting when bootstrapping', function() {
        assert(Migratable[collectionName].migrate === 'alter');
      });

      it('should have tables', function(done) {
        Migratable[collectionName].describe(function(err, schema) {
          assert(!err);
          assert(schema);
          done();
        });
      });


      describe('teardown and migrate existing data', function() {

        before(function(done) {
          Migratable[collectionName].create({ name: 'blackbeard' }, done);
        });

        it('should retain the data when bootstrapped the second time', function(done) {
          Migratable.waterline.teardown(function(err) {
            bootstrapFn(function(err, obj) {
              assert(!err);
              var ontology = obj.ontology;
              ontology.collections[collectionName.toLowerCase()].count().exec(function(err, numOfPirates) {
                assert(!err);
                assert(numOfPirates === 1, numOfPirates);
                done();
              });
            });
          });
        });
      });

  }
});
