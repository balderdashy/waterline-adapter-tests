var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.destroy()', function() {
    describe('a single record', function() {
      before(function(done) {
        Semantic.User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err) {
          if (err) {
            return done(err);
          }
          
          return done();
        });
      });

      it('should destroy a record', function(done) {
        Semantic.User.destroy({ first_name: 'Destroy' }, function(err, report) {
          if (err) {
            return done(err);
          }
          console.log(err, report);
          Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
            if (err) {
              return done(err);
            }

            assert.strictEqual(users.length, 0);
            
            return done();
          });
        });
      });
    });

    describe('with numeric ID', function() {
      var user;

      // Create a user to test destroy on
      before(function(done) {
        Semantic.User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err, record) {
          if (err) {
            return done(err);
          }

          user = record;
          
          return done();
        });
      });

      it('should destroy a record', function(done) {
        Semantic.User.destroy(user.id, function(err, status) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 0);
          
          return done();
        });
      });
    });

    describe('multiple records', function() {
      beforeEach(function(done) {
        Semantic.User.createEach([
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' }
        ], done);
      });

      it('should destroy all the records', function(done) {
        Semantic.User.destroy(function(err, users) {
          if (err) {
            return done(err);
          }
          
          return done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        Semantic.User.find({ first_name: 'Destroy' }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 0);
          
          return done();
        });
      });
    });
  });
});
