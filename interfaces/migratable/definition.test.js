var assert = require('assert');

describe('Migratable Interface', function() {

  describe('definitions', function() {

    describe('autoCreatedAt', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should be on by default', function() {
        assert(Migratable.User.autoCreatedAt);
      });

      it('should cause new schema to have a createdAt attribute', function(done) {
        Migratable.User.describe(function (err, user) {
          assert(!err);
          assert(user.createdAt);
          done();
        });
      });
    });

    describe('autoUpdatedAt', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should be on by default', function() {
        assert(Migratable.User.autoUpdatedAt);
      });

      it('should cause new schema to have an updatedAt attribute', function(done) {
        Migratable.User.describe(function (err, user) {
          assert(!err);
          assert(user.updatedAt);
          done();
        });
      });
    });

    describe('autoPK', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should be set to use id by default', function() {
        assert(Migratable.User.autoPK);
      });

      it('should cause new schema to have an id attribute', function(done) {
        Migratable.User.describe(function (err, user) {
          assert(!err);
          assert(user.id);
          done();
        });
      });
    });

  });
});
