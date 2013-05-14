/**
 * Dependencies
 */

var fs = require('fs'),
    Path = require('path'),
    _ = require('underscore'),
    mocha = require('mocha');

module.exports = function(options) {

  if(!options.adapter) throw new Error('Must supply an adapter');

  this.adapter = options.adapter;
  this.config = options.config || {};

  global.Adapter = _.extend(this.adapter, this.config);

  // Build an array of files to test
  var files = lookupFiles(Path.resolve(__dirname,'./collection/'), true);

  var test = new mocha();

  test.globals([Adapter]);
  test.files = files;

  test.run();
};


function lookupFiles(path, recursive) {
  var files = [];

  if (!fs.existsSync(path)) path += '.js';
  var stat = fs.statSync(path);
  if (stat.isFile()) return path;

  fs.readdirSync(path).forEach(function(file) {
    file = Path.join(path, file);
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
      if (recursive) files = files.concat(lookupFiles(file, recursive));
      return;
    }

    var re = new RegExp('\\.(' + ['js'].join('|') + ')$');

    if (!stat.isFile() || !re.test(file) || Path.basename(file)[0] == '.') return;
    files.push(file);
  });

  return files;
}