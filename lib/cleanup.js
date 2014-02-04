
/**
 * Sets up an event bus for tracking collection fixtures
 * (so they can be wiped)
 */
var collections = {};

// Allow collection fixtures to be loaded 
// via an EventEmitter
Events.on('fixture', function(collection) {
  var name = collection.prototype.tableName || collection.prototype.identity;
  collections[name] = collection;
});



/**
 * Destroy all tracked collections after mocha tests are complete.
 */

after( require('./wipe') );