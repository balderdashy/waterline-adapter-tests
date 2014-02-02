/**
 * Module dependencies
 */

var bootstrapAndDescribe = require('../../lib/bootstrapAndDescribe'),
  assert = require('assert'),
  should = require('should');


describe('Migratable Interface', function() {
  describe('migrate: "alter"', function() {
    bootstrapAndDescribe({
      collections: {
        pirate: {
          migrate: 'alter',
          connection: 'test',
          attributes: {
            name: 'string',
            age: 'integer'
          }
        }
      }
    }, function testSuite (ontology) {

      it('sanity check first...', function () {
        ontology.should.be.an.Object;
        ontology.collections.should.be.an.Object;
        ontology.collections.pirate.should.be.an.Object;
        ontology.collections.pirate.migrate
          .should.equal('alter');
      });

      it('should have created tables', function (done) {      
        var conn = ontology.connections.test;
        conn._adapter.describe('test', 'pirate', function (err, schema) {
          should(schema).be.an.Object;
          done(err);
        });
      });

    });

  });
});
