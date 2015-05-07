/**
 * Module dependencies
 */
var setupWaterline = require('./support/bootstrap'),
    async = require('async'),
    _ = require('lodash');
var adapterName = process.env.ADAPTER_NAME || process.argv[2];
var config = {};
try {
  config = require('../integration/config/' + adapterName + '.json').config;
} catch(e){
  console.log('Failed to load config for ' + adapterName + ', will use default.');
}

var usersNumber = process.env.USERS_NUMBER || 3;
var petsNumber = process.env.PETS_NUMBER || 100;
var hitsNumber = process.env.HITS_NUMBER || 100;
var reportFreq = process.env.REPORT_FREQ || 10;

var measurements = [];
var connections = { 'load_test': config };
connections.load_test.adapter = 'default';


var waterline = setupWaterline({
  adapters: {
    'default': require(adapterName)
  },
  collections: {
    user: require('./support/fixtures/user'),
    pet: require('./support/fixtures/pet'),
  },
  connections: connections
}, function waterlineReady (err, ontology) {
  if (err) throw err;
  console.log('waterline initialized');

  // Our collections (i.e. models):
  global.WL_MODELS = ontology.collections;
  
  boostrapCollections(function(err){
    if(err) { handleError(err, 'failed to populate collections'); }
    console.log('collections created');
    
    process.stdout.write('\nHitting the db with ' + hitsNumber + ' requests...');
    console.time('time elapsed');
    
    loadTest(function(err){
      console.log();
      if(err) { handleError(err, 'failed to perform load test'); }
      
      console.timeEnd('time elapsed');
      console.log();
      
      // stay idle and then check memory
      setTimeout(function(){
        console.log('idle: ' + reportMemory(process.memoryUsage()) + '\n');
        printStats(measurements);
        
        tearDown(ontology.collections, function(err){
          if(err) { handleError(err, 'failed to teardown adapter'); }
          console.log('collections teardown done');
          
          process.exit(0);
        });
      }, 1000);

    });

  });  

});


function loadTest(cb){
  
  var memUsage = process.memoryUsage();
  measurements.push(memUsage);
  process.stdout.write('\n 0: ' + reportMemory(memUsage));
  var n = 0;
  
  function findAndPopulate (item, next) {
    WL_MODELS.pet.find().populate('owner')
      .then(function(){
        n++;
        if(n % reportFreq === 0){
          var memUsage = process.memoryUsage();
          measurements.push(memUsage);
          process.stdout.write('\n' + n + ': ' + reportMemory(memUsage));
        } else {
          process.stdout.write(' .');
        }
        next();
       })
      .catch(next);
  }
  
  // async.each / async.eachSeries
  async.each(_.range(1, hitsNumber+1), findAndPopulate, cb); 
}

function reportMemory(memUsage){
  return 'rss: ' + roundMB(memUsage.rss)
         + ' MB, heapTotal: ' + roundMB(memUsage.heapTotal) 
         + ' MB, heapUsed: ' + roundMB(memUsage.heapUsed)
         + ' MB';
}

function roundMB(num){
  return (num/1e6).toFixed(2);
}

function printStats(stats){
  var maxRss = _.max(_.pluck(stats, 'rss'));
  var maxHeapTotal = _.max(_.pluck(stats, 'heapTotal'));
  var maxHeapUsed = _.max(_.pluck(stats, 'heapUsed'));
  console.log('max: ' + reportMemory({ rss: maxRss, heapTotal: maxHeapTotal, heapUsed: maxHeapUsed }));
  
  var avgRss = _.reduce(_.pluck(stats, 'rss'), function(sum, num) { return sum + num; }) / stats.length;
  var avgHeapTotal = _.reduce(_.pluck(stats, 'heapTotal'), function(sum, num) { return sum + num; }) / stats.length;
  var avgHeapUsed = _.reduce(_.pluck(stats, 'heapUsed'), function(sum, num) { return sum + num; }) / stats.length;
  console.log('avg: ' + reportMemory({ rss: avgRss, heapTotal: avgHeapTotal, heapUsed: avgHeapUsed }) + '\n');
}

function boostrapCollections(cb){
  async.eachSeries(_.range(0, usersNumber), function (userIndex, innerCb) {
    WL_MODELS.user.create().exec(function (err, user) {
      if (err) {
        return innerCb(err);
      }
      async.eachSeries(_.range(0, petsNumber), function (petIndex, innerInnerCb) {
        WL_MODELS.pet.create({ owner: user.id }).exec(innerInnerCb);
      }, innerCb);
    });
  }, cb);
}

function handleError(err, message){
  console.error(message);
  console.error(err);
  process.exit(1);
}

function tearDown(collections, cb){
  
  function dropCollection(item, next) {    
    collections[item].drop(function(err) {
      if(err) return next(err);
      next();
    });
  }

  async.each(Object.keys(collections), dropCollection, function(err) {
    if(err) {
      console.log('ERROR:', err);
      cb(err);
    }
    
    waterline.teardown(cb);
  });
}