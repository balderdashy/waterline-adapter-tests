/**
 * Test runner dependencies
 */
var util = require('util');
var mocha = require('mocha');
var customDotReporter = require('./customDotReporter');

var adapterName = process.env.ADAPTER_NAME || process.argv[2];
var TestRunner = require('../../lib');
var Adapter = require(adapterName);
var settings = {};
try {
  settings = require('./config/' + adapterName);
} catch(e){
  console.warn("Warning: couldn't find config file for " + adapterName + ".");
}


// Grab targeted interfaces from this adapter's `package.json` file:
var package = {};
var interfaces = [];
var features = [];
try {
  package = require('../../node_modules/' + adapterName + '/package.json');
  interfaces = package['waterlineAdapter'].interfaces;
  features = package['waterlineAdapter'].features || [];
}
catch (e) {
  throw new Error(
    '\n'+
    'Could not read supported interfaces from "sails-adapter"."interfaces"'+'\n' +
    'in this adapter\'s `package.json` file :' + '\n' +
    util.inspect(e)
    );
}





console.info('Testing `' + package.name + '`, a Sails adapter.');
console.info('Running `waterline-adapter-tests` against ' + interfaces.length + ' interfaces...');
console.info('( ' + interfaces.join(', ') + ' )');
if (features.length) {
  console.info('and against ' + features.length + ' feature tests...');
  console.info('( ' + features.join(', ') + ' )');
}
console.log();
console.log('Latest draft of Waterline adapter interface spec:');
console.info('https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md');
console.log();




/**
 * Integration Test Runner
 *
 * Uses the `waterline-adapter-tests` module to
 * run mocha tests against the specified interfaces
 * of the currently-implemented Waterline adapter API.
 */
new TestRunner({

  // Load the adapter module.
  adapter: Adapter,

  // Default adapter config to use.
  config: settings,

  // The set of adapter interfaces to test against.
  // (grabbed these from this adapter's package.json file above)
  interfaces: interfaces,

  // The set of adapter features to test against.
  // (grabbed these from this adapter's package.json file above)
  features: features,

  // Mocha options
  // reference: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
  mocha: {
    reporter: customDotReporter
  },

  mochaChainableMethods: {},

  // Return code != 0 if any test failed
  failOnError: true

  // Most databases implement 'semantic' and 'queryable'.
  //
  // As of Sails/Waterline v0.10, the 'associations' interface
  // is also available.  If you don't implement 'associations',
  // it will be polyfilled for you by Waterline core.  The core
  // implementation will always be used for cross-adapter / cross-connection
  // joins.
  //
  // In future versions of Sails/Waterline, 'queryable' may be also
  // be polyfilled by core.
  //
  // These polyfilled implementations can usually be further optimized at the
  // adapter level, since most databases provide optimizations for internal
  // operations.
  //
  // Full interface reference:
  // https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md
});
