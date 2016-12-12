var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe('greaterThan (>)', function() {
      describe('numbers', function() {
        var testName = 'greaterThan test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.User.createEach(users, function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with > key', function(done) {
          Queryable.User.find({ 
            first_name: testName, 
            age: { 
              '>': 40 
            }
          })
          .sort({'age': 'desc'})
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.strictEqual(users.length, 3);
            assert.strictEqual(users[0].age, 41);
            
            return done();
          });
        });
      });

      describe('strings', function() {
        var testName = 'greaterThan strings test';

        before(function(done) {
          // Insert 10 Users
          var users = [];
          var date;

          for(var i=0; i<10; i++) {
            users.push({
              first_name: i + ' greaterThan_strings_user',
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with > key when searching strings', function(done) {
          Queryable.User.find({ 
            type: testName, 
            first_name: { 
              '>': '2 greaterThan_strings_user' 
            }
          })
          .sort({'first_name': 'desc'})
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.strictEqual(users.length, 7);
            assert.equal(users[0].first_name, '3 greaterThan_strings_user');
            
            return done();
          });
        });
      });
    });

    describe('greaterThanOrEqual (>=)', function() {
      describe('numbers', function() {
        var testName = 'greaterThanOrEqual test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.User.createEach(users, function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with >= key', function(done) {
          Queryable.User.find({ 
            first_name: testName, 
            age: { 
              '>=': 41 
            }
          })
          .sort({ 'age': 'desc' })
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.strictEqual(users.length, 3);
            assert.strictEqual(users[0].age, 41);
            
            return done();
          });
        });
      });


      describe('strings', function() {
        var testName = 'greaterThanOrEqual strings test';

        before(function(done) {
          // Insert 10 Users
          var users = [];
          var date;

          for(var i=0; i<10; i++) {
            users.push({
              first_name: i + ' greaterThanOrEqual_strings_user',
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });

        it('should return records with >= key when searching strings', function(done) {
          Queryable.User.find({ 
            type: testName, 
            first_name: { 
              '>=': '2 greaterThanOrEqual_strings_user' 
            }
          })
          .sort({ 'first_name': 'desc' })
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.strictEqual(users.length, 8);
            assert.equal(users[0].first_name, '2 greaterThanOrEqual_strings_user');
            
            return done();
          });
        });
      });
    });
  });
});
