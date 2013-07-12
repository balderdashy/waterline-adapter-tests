var Model = require('../fixtures/schema-options'),
    assert = require('assert');

describe('Collection', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('Schema', function() {

    describe('primaryKey', function() {

      it('should disable autoPK', function(done) {
        User.describe(function (err, user) {
          assert(!user.id);
          done();
        });
      });

      it('should set attribute as primary key', function(done) {
        User.describe(function (err, user) {
          assert(user.title.primaryKey === true);
          done();
        });
      });
    });

    describe('autoIncrement', function() {

      it('should set autoIncrement on schema attribute', function(done) {
        User.describe(function (err, user) {

          // Some databases like MySQL don't allow multiple autoIncrement values
          if(!user.number.autoIncrement) {
            console.log('Auto Increment was not set on the non primary-key attribute. If your ' +
              'database supports it you should look into this. Some databases like MySQL dont ' +
              'support multiple auto increment values');
            return done();
          }

          assert(user.number.autoIncrement === true);
          done();
        });
      });

      it('should increment an ID on insert', function(done) {
        User.describe(function (err, user) {

          // Some databases like MySQL don't allow multiple autoIncrement values
          if(!user.number.autoIncrement) {
            console.log('Auto Increment was not set on the non primary-key attribute. If your ' +
              'database supports it you should look into this. Some databases like MySQL dont ' +
              'support multiple auto increment values');
            return done();
          }

          User.create({ title: 'autoincrement 1' }, function(err, record) {
            assert(record.number === 1);
            User.create({ title: 'autoincrement 2' }, function(err, record) {
              assert(record.number === 2);
              done();
            });
          });
        });
      });

      it('should not allow multiple records with the same PK', function(done) {
        User.create({ title: '100' }, function(err, record) {
          assert(record.title === '100');
          User.create({ title: '100' }, function(err, record) {
            assert(err);
            assert(!record);
            done();
          });
        });
      });

    });

    describe('uniqueness', function() {

      it('should set unique on schema attribute', function(done) {
        User.describe(function (err, user) {
          assert(user.serialNumber.unique === true);
          done();
        });
      });

      it('should return an error if unique constraint fails', function(done) {
        User.create({ title: 'uniqueConstraint 1', serialNumber: 'test' }, function(err, record) {
          assert(!err);
          assert(record.serialNumber === 'test');

          User.create({ title: 'uniqueConstraint 2', serialNumber: 'test' }, function(err, record) {
            assert(!record);
            assert(err);
            done();
          });
        });
      });
    });

  });
});
