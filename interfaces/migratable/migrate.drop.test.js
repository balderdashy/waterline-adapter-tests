/**
 * Module dependencies
 */
var bootstrap = require('../../lib/bootstrap'),
    assert = require('assert');



describe('Migratable Interface', function() {

  var ontology, waterline;

  //
  // Setup waterline
  //

  before(function(done) {
    waterline = bootstrap({
      adapters: { wl_tests: Adapter },
      connections: Connections,
      collections: {
        pirate: {
          connection: 'test',
          attributes: {
            name: 'string',
            age: 'integer'
          }
        }
      }
    }, function(err, _ontology) {
      if(err) return done(err);
      ontology = _ontology;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });



  //
  // Test that migration was successful
  //

  it('should have created tables', function (done) {

    // eventually, access to connections will be wrapped up:
    // tmp.describe('foo', console.log);

    // for now:
    var tmp = ontology.connections.tmp;
    tmp._adapter.describe('tmp', 'foo', console.log);

  });



});