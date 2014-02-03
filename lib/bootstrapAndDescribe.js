/**
 * Module dependencies
 */

var bootstrap = require('./bootstrap')
  , _ = require('lodash');



/**
 * Helper which injects a mocha `describe` with 
 * `before` and `after` functions inside.
 * 
 * It sets up and tears down an instance of Waterline,
 * and injects the specified function full of tests
 * in-between.  The `tests` function receives `ontology`
 * as its last argument.
 *
 * @param {Object} options
 * @param {Function} tests
 */
module.exports = function bootstrapAndDescribe ( options, tests ) {
  
  var waterline;

  // (must be an object here, and then extended,
  // so it'll be accessible to `tests`)
  var ontology = {};

  describe('(after bootstrapping waterline...)', function () {

    before(function(done) {
      waterline = bootstrap(options, function(err, _ontology) {
        if(err) return done(err);
        ontology = _.extend(ontology,_ontology);        
        done();
      });
    });

    // Inject tests here
    tests(ontology);

    after(function(done) {
      waterline.teardown(done);
    });

  });
};


    //
    // Side note on using connection objects:
    // 
    // eventually, access to connections will be wrapped up:
    // conn.describe('foo', console.log);
    // 
    // 
    // 


