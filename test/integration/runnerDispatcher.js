var exec = require('child_process').exec;
var async = require('async');

// The adapters being tested
var adapters = ['sails-postgresql', 'sails-memory', 'sails-disk', 'sails-mongo', 'sails-mysql'];

var status = {};
process.env.FORCE_COLORS = true;

console.time('total time elapsed');

var resultTable = "\n";
resultTable += " --------------------------------------------- \n";
resultTable += "| adapter          | status  | failed | total |\n";
resultTable += "|------------------|---------|--------|-------|\n";

async.eachSeries(adapters, function(adapterName, next){
  status[adapterName] = { failed: 0, total: 0, exitCode: 0 };
  
  console.log("\n");
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log("\033[0;34m                                     %s \033[0m", adapterName);
  console.log("\033[0;34m-------------------------------------------------------------------------------------------\033[0m");
  console.log();
  
  var child = exec('node ./test/integration/runner.js ' + adapterName, { env: process.env });
  child.stdout.on('data', function(data) {
    if(isDot(data)) { status[adapterName].total++; }
    process.stdout.write(data);
  });
  child.stderr.on('data', function(data) {
    if(isDot(data)) { 
      status[adapterName].total++;
      status[adapterName].failed++;
    }
    process.stdout.write(data);
  });
  child.on('close', function(code) {
    status[adapterName].exitCode = code;
    var message = code == 0 ? "\033[0;32msuccess\033[0m" : "\033[0;31mfailed \033[0m";
    resultTable += "| " + padRight(adapterName, 16) 
      + " | " + message 
      + " | " + padLeft(status[adapterName].failed, 6) 
      + " | " + padLeft(status[adapterName].total, 5) 
      + " |\n";
    
    console.log('exit code: ' + code);
    next();
  });
}, 
function(){
  resultTable += " --------------------------------------------- \n";
  console.log(resultTable);
  console.timeEnd('total time elapsed');
});


/**
 * Aux functions
 */
function isDot(data){
  return data == '․' || (data.length === 10 /*&& data[0] === '\u001b'*/ && data.charAt(5) === '․'.charAt(0));
}

function padRight(str, padding){
  var res = "" + str;
  for(var i=res.length; i<padding; i++){
    res += ' ';
  }
  return res;
}

function padLeft(str, padding){
  str = str + "";
  var pad = "";
  for(var i=str.length; i<padding; i++){
    pad += ' ';
  }
  return pad + str;
};
