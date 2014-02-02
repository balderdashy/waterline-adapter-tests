/**
 * Module dependencies
 */
 
var bootstrapAndDescribe = require('../../lib/bootstrapAndDescribe'),
  assert = require('assert'),
  should = require('should');



describe('Migratable Interface', function() {
  describe('migrate: "drop"', function() {

    //
    // Side note on using connection objects:
    // 
    // eventually, access to connections will be wrapped up:
    // conn.describe('foo', console.log);
    // 

    bootstrapAndDescribe({
      collections: {
        pirate: {
          migrate: 'drop',
          connection: 'test',
          attributes: {
            name: 'string',
            age: 'integer'
          }
        }
      }
    }, function (ontology) {

      it('sanity check first...', function () {
        ontology.should.be.an.Object;
        ontology.collections.should.be.an.Object;
        ontology.collections.pirate.should.be.an.Object;
        ontology.collections.pirate.migrate
          .should.equal('drop');
      });

      it('should have created tables', function (done) {      
        var conn = ontology.connections.test;
        conn._adapter.describe('test', 'pirate', function (err, schema) {
          should(schema).be.an.Object;
          done(err);
        });
      });

      it('should have deleted any data that was there', function (done) {
        var Pirate = ontology.collections.pirate;
        Pirate.count().exec(function (err, numPirates) {
          assert(numPirates === 0);
          return done(err);
        });
      });

    });


  });

});
