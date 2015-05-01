var assert = require('assert');

describe('Migratable Interface', function() {

  describe('Schema', function() {

    describe('primaryKey', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should disable autoPK', function(done) {
        Migratable.Document.describe(function (err, user) {
          assert(!user.id);
          done();
        });
      });

      it('should set attribute as primary key', function(done) {
        Migratable.Document.describe(function (err, user) {
          assert(user.title.primaryKey === true);
          done();
        });
      });
    });

    describe('autoIncrement', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      //
      // TODO:
      // pull auto-increment tests into a different interface
      //

      // it('should set autoIncrement on schema attribute', function(done) {
      //   Document.describe(function (err, user) {

      //     // Some databases like MySQL don't allow multiple autoIncrement values
      //     if(!user.number.autoIncrement) {
      //       console.log('Auto Increment was not set on the non primary-key attribute. If your ' +
      //         'database supports it you should look into this. Some databases like MySQL dont ' +
      //         'support multiple auto increment values');
      //       return done();
      //     }

      //     assert(user.number.autoIncrement === true);
      //     done();
      //   });
      // });

      // it('should increment an ID on insert', function(done) {
      //   Document.describe(function (err, user) {

      //     // Some databases like MySQL don't allow multiple autoIncrement values
      //     if(!user.number.autoIncrement) {
      //       console.log('Auto Increment was not set on the non primary-key attribute. If your ' +
      //         'database supports it you should look into this. Some databases like MySQL dont ' +
      //         'support multiple auto increment values');
      //       return done();
      //     }

      //     Document.create({ title: 'autoincrement 1' }, function(err, record) {
      //       assert(record.number === 1);
      //       Document.create({ title: 'autoincrement 2' }, function(err, record) {
      //         assert(record.number === 2);
      //         done();
      //       });
      //     });
      //   });
      // });

      it('should not allow multiple records with the same PK', function(done) {
        Migratable.Document.create({ title: '100' }, function(err, record) {
          assert(record.title === '100');
          Migratable.Document.create({ title: '100' }, function(err, record) {
            assert(err);
            assert(!record);
            done();
          });
        });
      });

    });

    describe('uniqueness', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should set unique on schema attribute', function(done) {
        Migratable.Document.describe(function (err, user) {
          assert(user.serialNumber.unique === true);
          done();
        });
      });

      it('should return an error if unique constraint fails', function(done) {
        Migratable.Document.create({ title: 'uniqueConstraint 1', serialNumber: 'test' }, function(err, record) {
          assert(!err);
          assert(record.serialNumber === 'test');

          Migratable.Document.create({ title: 'uniqueConstraint 2', serialNumber: 'test' }, function(err, record) {
            assert(!record);
            assert(err);
            done();
          });
        });
      });
    });

  });
});
