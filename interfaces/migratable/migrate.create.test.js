/*
 * Module dependencies
 */

var Waterline = require('waterline'),
    assert = require('assert'),
    bootstrapFn = require('./support/bootstrapFn');

var newFixture = {
  CreateFixture : Waterline.Collection.extend({

    tableName : 'create',
    connection : 'migratable',
    migrate : 'create',

    attributes : {
      name : 'string',
      age : 'integer',
      gender : 'string'
    }
  })
};


describe('Migratable Interface', function() {

  describe('migrate: "create"', function() {
    runTests("Create");
  });

  function runTests(collectionName) {

    it('should have the proper migrate setting when bootstrapping', function() {
      assert(Migratable[collectionName].migrate === 'create');
    });

    it('should have tables', function(done) {
      Migratable[collectionName].describe(function(err, schema) {
        assert.ifError(err);
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
            assert.ifError(err);
            var ontology = obj.ontology;
            ontology.collections[collectionName.toLowerCase()].findOne({name: 'blackbeard'})
              .exec(function(err, pirate) {
                assert.ifError(err);
                assert.equal(pirate.name, 'blackbeard');
                done();
              });
          });
        });
      });
    });


    describe('teardown and migrate existing data after adding property', function() {

      var collection;

      before(function(done) {
        Migratable[collectionName].create({ name : 'bluebeard' }, function(err) {
          if(err) { return done(err); }
          Migratable.waterline.teardown(function(err) {
            bootstrapFn(newFixture, function(err, obj) {
              assert.ifError(err);
              var ontology = obj.ontology;
              ontology.collections[collectionName.toLowerCase()].findOne({name: 'bluebeard'});
              collection = ontology.collections[collectionName.toLowerCase()];
              done();
            });
          });
        });
      });

      it('should retain the data when bootstrapped the second time', function(done) {
        collection.findOne({name: 'bluebeard'})
        .exec(function(err, pirate) {
          assert.ifError(err);
          assert.equal(pirate.name, 'bluebeard');
          done();
        });
      });

      it('should have new attribute', function(done) {
        collection.describe(function(err, schema) {
          assert.ifError(err);
          assert(schema);
          assert(schema.name);
          assert(schema.gender);
          done();
        });
      });


      it('should be able to record data using new attribute', function(done) {
        collection.create({ name: 'whitebeard', gender: 'male' })
        .exec(function(err, newPirate) {
          assert.ifError(err);
          assert.equal(newPirate.name, 'whitebeard');
          assert.equal(newPirate.gender, 'male');  // requires addAttribute
          done();
        });
      });

    });
  }
});
