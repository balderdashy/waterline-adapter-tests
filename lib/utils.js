var fs = require('fs'),
    Path = require('path');

/**
 * File Loader
 *
 * @param {String} path
 * @param {String} filter
 * @param {Boolean} recursive
 * @return {Array}
 */

exports.fileLookup = function fileLookup(path, filter, recursive) {
  var files = [];

  if (!fs.existsSync(path)) path += '.js';

  // Check if path is a file or directory
  var stat = fs.statSync(path);
  if (stat.isFile()) return path;

  fs.readdirSync(path).forEach(function(file) {
    file = Path.join(path, file);

    // If file is a directory, recursivly call function again
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
      if (recursive) files = files.concat(fileLookup(file, filter, recursive));
      return;
    }

    var re = new RegExp(filter);

    if (!stat.isFile() || !re.test(file) || Path.basename(file)[0] == '.') return;
    files.push(file);
  });

  return files;
};
