/**
 * Dependencies
 */

var Path = require('path'),
    _ = require('lodash'),
    utils = require('./utils'),
    mocha = require('mocha'),
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
  this.adapter.config = this.config;

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
  var test = new mocha();

  // Build a global event emitter to keep track of what models we need to clean up
  global.Events = new EventEmitter();

  // Add cleanup to files
  files.push(Path.resolve(__dirname, './cleanup'));

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter, Events]);
  test.files = files;

  test.run(function(err) {
    process.exit(0);
  });
};


/**
 * File Loader
 *
 * @param {String} path
 * @param {Boolean} recursive
 * @return {Array}
 */

// function lookupFiles(path, recursive) {
//   var files = [];

//   if (!fs.existsSync(path)) path += '.js';

//   // Check if path is a file or directory
//   var stat = fs.statSync(path);
//   if (stat.isFile()) return path;

//   fs.readdirSync(path).forEach(function(file) {
//     file = Path.join(path, file);

//     // If file is directory recursivly call function again
//     var stat = fs.statSync(file);
//     if (stat.isDirectory()) {
//       if (recursive) files = files.concat(lookupFiles(file, recursive));
//       return;
//     }

//     var re = new RegExp('\\.(' + ['js'].join('|') + ')$');

//     if (!stat.isFile() || !re.test(file) || Path.basename(file)[0] == '.') return;
//     files.push(file);
//   });

//   return files;
// }
