/*
 * Module dependencies
 */

var assert = require('assert'),
    bootstrapFn = require('./support/bootstrapFn');

describe('Migratable Interface', function() {

  describe('migrate: "alter"', function() {

    it('should have the proper migrate setting when bootstrapping', function() {
      assert(Migratable.Alter.migrate === 'alter');
    });

    it('should have tables', function(done) {
      Migratable.Alter.describe(function(err, schema) {
        if(err) return done(err);
        assert(schema);
        done();
      });
    });


    describe('teardown and migrate existing data', function() {

      before(function(done) {
        Migratable.Alter.create({ name: 'blackbeard' }, done);
      });

      it('should retain the data when bootstrapped the second time', function(done) {
        Migratable.waterline.teardown(function(err) {
          bootstrapFn(function(err, obj) {
            if(err) return done(err);
            var ontology = obj.ontology;

            ontology.collections.alter.count().exec(function(err, numOfPirates) {
              if(err) return done(err);
              assert(numOfPirates === 1);
              done();
            });
          });
        });
      });
    });

  });
});
