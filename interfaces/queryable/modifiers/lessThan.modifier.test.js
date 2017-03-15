var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe('less than (<)', function() {
      describe('numbers', function() {
        var testName = 'lessThan test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.Userforqueryableinterface.createEach(users, function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with < key', function(done) {
          Queryable.Userforqueryableinterface.find({ 
            first_name: testName, 
            age: { 
              '<': 42 
            }
          })
          .sort([{age: 'asc'}])
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }
            
            assert(Array.isArray(users));
            assert.strictEqual(users.length, 2);
            assert.strictEqual(users[0].age, 40);
            
            return done();
          });
        });
      });
    });

    describe('less than or equal (<=)', function() {
      describe('numbers', function() {
        var testName = 'lessThanOrEqual test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.Userforqueryableinterface.createEach(users, function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with < key', function(done) {
          Queryable.Userforqueryableinterface.find({ 
            first_name: testName, 
            age: { 
              '<=': 42 
            }
          })
          .sort([{age: 'asc'}])
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.strictEqual(users.length, 3);
            assert.strictEqual(users[0].age, 40);
            
            return done();
          });
        });
      });
    });
  });
});
