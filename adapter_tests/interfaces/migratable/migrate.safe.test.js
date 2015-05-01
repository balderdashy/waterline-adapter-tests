/*
 * Module dependencies
 */

var assert = require('assert'),
    bootstrapFn = require('./support/bootstrapFn');

describe('Migratable Interface', function() {

  describe('migrate: "safe"', function() {

    it('should have the proper migrate setting when bootstrapping', function() {
      assert(Migratable.Safe.migrate === 'safe');
    });

    it('should have NOT have tables', function(done) {
      Migratable.Safe.describe(function(err, schema) {
        assert(!err);
        assert(!schema);
        done();
      });
    });

  });
});
