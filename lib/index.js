/**
 * Dependencies
 */

var Path = require('path'),
    _ = require('lodash'),
    utils = require('./utils'),
    mocha = require('mocha'),
    Waterline = require('waterline'),
    wipeCollections = require('./wipe'),
    EventEmitter = require('events').EventEmitter;

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
  var test = new mocha(options.mocha || {});

  // Build a global event emitter to keep track of what models we need to clean up
  global.Events = new EventEmitter();

  // Add cleanup to files (to run afterwards)
  // files.push(Path.resolve(__dirname, './cleanup'));

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter, Events, Connections]);
  test.files = files;




  // Cleanup beforehand, in case the tests
  // were stopped early last time.

  // But to do that, we have to know what collections
  // are in the database.  Here's a set of the ones
  // used in our tests:
  var collectionsUsedInTests = _.reduce([
    'customer', 'customer_many', 'document', 'driver',
    'payment', 'payment_many', 'pirate', 'stadium', 'taxi',
    'team', 'user', 'venue'
  ], function (collectionsUsedInTests, id) {
    collectionsUsedInTests[id] = Waterline.Collection.extend({
      identity: id,
      migrate: 'drop',
      connection: 'test'
    });
    return collectionsUsedInTests;
  }, {});

  wipeCollections(collectionsUsedInTests, function (err){
    if (err) throw err;

    test.run(function(err) {
      console.log('done');
      process.exit(0);
    });
    // process.exit(0);
    
  });

};
