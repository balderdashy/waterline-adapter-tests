/**
 * Dependencies
 */

var Path = require('path'),
    _ = require('lodash'),
    utils = require('./utils'),
    crossAdapterRunner = require('../features/crossAdapter/core/crossAdapter'),
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
  this.features = _.clone(options.features || []);
  
  // cross-adapter is a special case since it requires a clean test cache for
  // running existing associations tests
  var crossAdapterIndex = this.features.indexOf('crossAdapter');
  if (crossAdapterIndex === -1) {
    crossAdapterIndex = this.features.indexOf('cross-adapter');
  }
  var runCrossAdapterTests;
  if(crossAdapterIndex >= 0){
    this.features.splice(crossAdapterIndex, 1);
    runCrossAdapterTests = true;
  }

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

  this.features.forEach(function(feature) {
    var parts = feature.split('.');
    if (parts.length > 2) {
      throw new Error("Only one level of sub-features is supported, please use only one '.': " + feature);
    }

    var featurePath = Path.resolve(__dirname,'../features/' + parts[0] + '/core');
    if (require('fs').existsSync(featurePath)) {
      files = files.concat(utils.fileLookup(featurePath, filter, true));

      if (parts.length == 2) {
        featurePath = Path.resolve(__dirname,'../features/' + parts[0] + '/' + parts[1]);
        files = files.concat(utils.fileLookup(featurePath, filter, true));
      }      
    }
  });
  // There might be duplicate files if multiple sub-features of a single feature is being tested.
  files = _.unique(files);

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
  global.adapterFeatures = this.features;

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter, Connections, Associations, Semantic, Queryable, Sql, adapterFeatures]);
  test.files = files;
  
  var exit = function(err, failOnError){
    if (err && failOnError) {
      var exitCode = isNaN(err) ? 1 : err;
      process.exit(exitCode);
    } else {
      process.exit(0);
    }
  };

  console.time('time elapsed');
  var runner = test.run(function(err) {
    console.timeEnd('time elapsed');
    
    if(runCrossAdapterTests){
      crossAdapterRunner.cleanTestCache(test.files);
      crossAdapterRunner(options, function(crossAdapterErr){
        exit(err || crossAdapterErr, options.failOnError);
      });
    } else {
      exit(err, options.failOnError);
    }
  });

  runner.on('fail', function (e) {
    console.error(e.err);
  });
};
