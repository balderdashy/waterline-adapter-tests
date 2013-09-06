/**
 * Dependencies
 */

var Path = require('path'),
    _ = require('lodash'),
    utils = require('./utils'),
    mocha = require('mocha');

/**
 * Test Runner
 *
 * @param {Object} options
 * @api public
 */

module.exports = function(options) {

  if(!options.adapter) throw new Error('Must supply an adapter');

  this.adapter = options.adapter;
  this.config = options.config || {};

  // Attach config to adapter
  this.adapter.config = this.config;

  // Globalize Adapter
  global.Adapter = this.adapter;

  // Build an array of files to test
  var filter = '\\.(' + ['js'].join('|') + ')$';
  var files = utils.fileLookup(Path.resolve(__dirname,'../interfaces'), filter, true);

  // Build a Mocha Runner
  var test = new mocha();

  // Allow Adapter to be a global without warning about a leak
  test.globals([Adapter]);
  test.files = files;

  test.run(function(err) {
    process.exit();
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
