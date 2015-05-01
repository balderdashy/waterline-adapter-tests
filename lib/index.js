/**
 * Dependencies
 */

var Path = require('path');
var _ = require('lodash');
var async = require('async');
var utils = require('./utils');
var mocha = require('mocha');
var memoryAdapter = require('sails-memory');

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
    'test': this.config,
    'test2': { schema: false }
  };

  global.Connections.test.adapter = 'wl_tests';
  global.Connections.test2.adapter = 'wl_tests2';

  // Globalize Adapter
  global.Adapter = this.adapter;
  global.MemoryAdapter = memoryAdapter;

  // Build an array of files to test
  var filter = '\\.(' + ['js'].join('|') + ')$';

  // Load files for the specified interfaces that are supported by the adapter
  var interfaceFiles = [];
  this.interfaces.forEach(function(interface) {
    var interfacePath = Path.resolve(__dirname,'../adapter_tests/interfaces/' + interface);
    interfaceFiles = interfaceFiles.concat(utils.fileLookup(interfacePath, filter, true));
  });

  // Load files for the features tested by the adapter
  var featureFiles = [];

  // Load crossAdapter test files if the association interface is supported
  if(_.includes(this.interfaces, 'associations')) {
    var featurePath = Path.resolve(__dirname,'../adapter_tests/cross_adapter');
    featureFiles = featureFiles.concat(utils.fileLookup(featurePath, filter, true));
  }

  // Run various tests
  async.series([

    // Run interface tests
    function(cb) {

      if(!interfaceFiles.length) {
        return setImmediate(cb);
      }

      // Set Global Placeholders for Ontologies
      global.Associations = {};
      global.Semantic = {};
      global.Queryable = {};
      global.Migratable = {};
      global.Sql = {};

      // Build a Mocha Runner
      var test = new mocha(_.merge({
        timeout: 6000
      }, options.mocha||{}));

      if (options.mochaChainableMethods){
        _.forEach(options.mochaChainableMethods, function(arg, method){
          test[method](arg);
        });
      }

      // Allow Adapter to be a global without warning about a leak
      test.globals([Adapter, MemoryAdapter, Connections, Associations, Semantic, Queryable, Sql]);

      // Load interface test files
      test.files = interfaceFiles;

      console.info('\nTesting interfaces...\n');

      console.time('time elapsed');
      var runner = test.run(function(err) {
        console.timeEnd('time elapsed');
        if(err) {
          cb(err);
        }

        cb();
      });

      runner.on('fail', function (e) {
        console.error(e.err);
      });
    },

    // Run feature tests
    function(cb) {

      // Set Global Placeholders for Ontologies
      global.Associations = {};
      global.Semantic = {};
      global.Queryable = {};
      global.Migratable = {};
      global.Sql = {};

      // Build a Mocha Runner
      var test = new mocha(_.merge({
        timeout: 6000
      }, options.mocha||{}));

      if (options.mochaChainableMethods){
        _.forEach(options.mochaChainableMethods, function(arg, method){
          test[method](arg);
        });
      }

      // Allow Adapter to be a global without warning about a leak
      test.globals([Adapter, MemoryAdapter, Connections, Associations, Semantic, Queryable, Sql]);

      // Load feature test files
      test.files = featureFiles;
      console.info('\nTesting features...\n');

      console.time('time elapsed');
      var runner = test.run(function(err) {
        console.timeEnd('time elapsed');
        if(err) {
          cb(err);
        }

        cb();
      });

      runner.on('fail', function (e) {
        console.error(e.err);
      });
    }

  ],

  function(err) {
    if(err && options.failOnError) {
      process.exit(1);
    }

    process.exit(0);
  });

};
