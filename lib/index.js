/**
 * Dependencies
 */

var Path = require('path'),
    _ = require('lodash'),
    utils = require('./utils'),
    crossAdapterRunner = require('./crossAdapter'),
    mocha = require('mocha');

/**
 * Test Runner
 *
 * @param {Object} options
 * @api public
 */

module.exports = function(options) {

  if(!options.adapter) throw new Error('Must supply an adapter');
  if(!options.interfaces) throw new Error('Must supply a list of supported interfaces');
  if(!Array.isArray(options.interfaces)) throw new Error('Must supply a list of supported interfaces');

  this.adapter = options.adapter;
  this.config = options.config || {};
  this.interfaces = options.interfaces;

  // Attach config to adapter
  // this.adapter.config = this.config;
  global.Connections = {
    'test': this.config
  };

  global.Connections.test.adapter = 'wl_tests';

  // Globalize Adapter
  global.Adapter = this.adapter;

  // Build an array of files to test
  var filter = '\\.(' + ['js'].join('|') + ')$';

  var files = [];

  this.interfaces.forEach(function(interface) {
    var interfacePath = Path.resolve(__dirname,'../interfaces/' + interface);
    files = files.concat(utils.fileLookup(interfacePath, filter, true));
  });

  // Build a Mocha Runner
  var test = new mocha(_.merge({
    timeout: 6000
  }, options.mocha||{}));
  
  if (options.mochaChainableMethods){
    _.forEach(options.mochaChainableMethods, function(arg, method){
      test[method](arg);
    });
  }

  // Set Global Placeholders for Ontologies
  global.Associations = {};
  global.Semantic = {};
  global.Queryable = {};
  global.Migratable = {};
  global.Sql = {};

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter, Connections, Associations, Semantic, Queryable, Sql]);
  test.files = files;
  
  var exit = function(err, failOnError){
    if (err && failOnError) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  };

  console.time('time elapsed');
  var runner = test.run(function(err) {
    console.timeEnd('time elapsed');
    if(options.interfaces.indexOf('associations') > -1){
      crossAdapterRunner.cleanTestCache(test.files);
      crossAdapterRunner(options, function(crossAdapterErr){
        // TODO: for now don't throw cross adapter tests errors but change this eventually
        exit(err, options.failOnError);
      });
    } else {
      exit(err, options.failOnError);
    }
  });

  runner.on('fail', function (e) {
    console.error(e.err);
  });
};
