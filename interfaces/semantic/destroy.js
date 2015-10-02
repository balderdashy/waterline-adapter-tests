var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.destroy()', function() {

    describe('a single record', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {
        Semantic.User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy a record', function(done) {
        Semantic.User.destroy({ first_name: 'Destroy' }, function(err, records) {
          assert(!err);
          assert(Array.isArray(records));
          assert.strictEqual(records.length, 1);
          assert.equal(records[0].first_name, 'Destroy');
          assert.equal(records[0].last_name, 'Test');
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
          assert.strictEqual(users.length, 0);
          done();
        });
      });

    });

    describe('with numeric ID', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var user;

      // Create a user to test destroy on
      before(function(done) {
        Semantic.User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err, record) {
          if(err) return done(err);
          user = record;
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy a record', function(done) {
        Semantic.User.destroy(user.id, function(err, status) {
          assert(!err);
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
          assert.strictEqual(users.length, 0);
          done();
        });
      });
    });

    describe('multiple records', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      beforeEach(function(done) {
        Semantic.User.createEach([
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' }
        ], done);
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy all the records', function(done) {
        Semantic.User.destroy(function(err, users) {
          assert(!err);
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
          assert.strictEqual(users.length, 0);
          done();
        });
      });
    });

    describe('IN query', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      beforeEach(function(done) {
        Semantic.User.createEach([
          { first_name: 'dummy_test_in' },
          { first_name: 'dummy_test_in' },
          { first_name: 'dummy_test_in' }
        ], done);
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should not destroy any records', function(done) {
        Semantic.User.destroy({ id: [] }, function(err, users) {
          assert(!err);
          assert.strictEqual(users.length, 0);

          Semantic.User.find({ first_name: 'dummy_test_in' }, function(err, users) {
            assert(!err);
            assert.strictEqual(users.length, 3);
            done();
          });
        });
      });

    });
  });
});
