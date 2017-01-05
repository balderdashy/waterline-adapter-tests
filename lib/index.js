/**
 * Dependencies
 */

var path = require('path');
var fs = require('fs');
var _ = require('@sailshq/lodash');
var mocha = require('mocha');
var utils = require('./utils');

/**
 * Test Runner
 *
 * @param {Object} options
 * @api public
 */

module.exports = function(options) {
  if (!options.adapter) {
    throw new Error('Must supply an adapter');
  }

  if (!options.interfaces) {
    throw new Error('Must supply a list of supported interfaces');
  }

  if (!_.isArray(options.interfaces)) {
    throw new Error('Must supply a list of supported interfaces');
  }

  var adapter = options.adapter;
  var config = options.config || {};
  var interfaces = options.interfaces;
  var features = options.features || [];

  // Turn off cross-adapter tests for now.
  features = _.without(features, 'crossAdapter', 'cross-adapter');
  
  // cross-adapter is a special case since it requires a clean test cache for
  // running existing associations tests
  var crossAdapterIndex = _.indexOf(features, 'crossAdapter');
  if (crossAdapterIndex < 0) {
    crossAdapterIndex = _.indexOf(features, 'cross-adapter');
  }

  var runCrossAdapterTests;
  if(crossAdapterIndex >= 0){
    features.splice(crossAdapterIndex, 1);
    runCrossAdapterTests = true;
  }
  
  // Attach config to adapter
  global.Connections = {
    'test': config
  };

  global.Connections.test.adapter = 'wl_tests';

  // Globalize Adapter
  global.Adapter = adapter;

  // Build an array of files to test
  var filter = '\\.(' + ['js'].join('|') + ')$';

  var files = [];

  _.each(interfaces, function(interface) {
    var interfacePath = path.resolve(__dirname,'../interfaces/' + interface);
    files = files.concat(utils.fileLookup(interfacePath, filter, true));
  });

  _.each(features, function(feature) {
    var parts = feature.split('.');
    if (parts.length > 2) {
      throw new Error("Only one level of sub-features is supported, please use only one '.': " + feature);
    }

    var featurePath = path.resolve(__dirname,'../features/' + parts[0] + '/core');
    if (fs.existsSync(featurePath)) {
      files = files.concat(utils.fileLookup(featurePath, filter, true));

      if (parts.length == 2) {
        featurePath = path.resolve(__dirname,'../features/' + parts[0] + '/' + parts[1]);
        files = files.concat(utils.fileLookup(featurePath, filter, true));
      }      
    }
  });

  // There might be duplicate files if multiple sub-features of a single feature is being tested.
  files = _.unique(files);

  // Build a Mocha Runner
  var mochaOptions = options.mocha || {};
  var test = new mocha(_.merge({
    timeout: 6000
  }, mochaOptions));
  
  if (options.mochaChainableMethods){
    _.each(options.mochaChainableMethods, function(arg, method){
      test[method](arg);
    });
  }

  // Set Global Placeholders for Ontologies
  global.Associations = {};
  global.Semantic = {};
  global.Queryable = {};
  global.Migratable = {};
  global.Sql = {};
  global.adapterFeatures = features;

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
    
    if (runCrossAdapterTests) {
      var crossAdapterRunner = require('../features/crossAdapter/core/crossAdapter');
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
