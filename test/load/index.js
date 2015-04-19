var exec = require('child_process').exec,
    async = require('async');

var adapters = ['sails-postgresql', 'sails-memory', 'sails-disk', 'sails-mongo', 'sails-mysql', 'sails-redis'];
if (process.argv.length > 2) {
  adapters = process.argv.splice(2);
}
console.log('About to test ' + adapters + ' ...');

console.time('total time elapsed');

async.eachSeries(adapters, function(adapterName, next){
  console.log("\n");
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log("\033[0;34m                                     %s \033[0m", adapterName);
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log();
  
  var child = exec('node ./test/load/runner.js ' + adapterName);
  child.stdout.on('data', function(data){
    process.stdout.write(data);
  });
  child.stderr.on('data', function(data){
    process.stdout.write(data);
  });
  child.on('close', function(code) {
    console.log('closing code: ' + code);
    next();
  });
  
}, function allDone(err, results){
  console.timeEnd('total time elapsed');
});