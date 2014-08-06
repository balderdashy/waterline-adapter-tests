var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('greaterThan (>)', function() {
      describe('integers', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThan test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.User.createEach(users, function(err) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThan key', function(done) {
          Queryable.User.find({ first_name: testName, age: { greaterThan: 40 }}).sort('age').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 3);
            assert(users[0].age === 41);
            done();
          });
        });

        it('should return records with symbolic usage > usage', function(done) {
          Queryable.User.find({ first_name: testName, age: { '>': 40 }}).sort('age').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 3);
            assert(users[0].age === 41);
            done();
          });
        });
      });

      describe('dates', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThan dates test';

        before(function(done) {
          // Insert 10 Users
          var users = [],
              date;

          for(var i=0; i<10; i++) {
            date = new Date(2013,10,1);
            date.setDate(date.getDate() + i);

            users.push({
              first_name: 'greaterThan_dates_user' + i,
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThan key when searching dates', function(done) {
          Queryable.User.find({ type: testName, dob: { greaterThan: new Date(2013, 10, 9) }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === 'greaterThan_dates_user9');
            done();
          });
        });

        it('should return records with symbolic usage > usage when searching dates', function(done) {
          Queryable.User.find({ type: testName, dob: { '>': new Date(2013, 10, 9) }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === 'greaterThan_dates_user9');
            done();
          });
        });

      });

      describe('strings', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThan strings test';

        before(function(done) {
          // Insert 10 Users
          var users = [],
              date;

          for(var i=0; i<10; i++) {
            users.push({
              first_name: i + ' greaterThan_strings_user',
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThan key when searching strings', function(done) {
          Queryable.User.find({ type: testName, first_name: { greaterThan: '2 greaterThan_strings_user' }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 7);
            assert(users[0].first_name === '3 greaterThan_strings_user');
            done();
          });
        });

        it('should return records with symbolic usage > usage when searching strings', function(done) {
          Queryable.User.find({ type: testName, first_name: { '>': '2 greaterThan_strings_user' }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 7);
            assert(users[0].first_name === '3 greaterThan_strings_user');
            done();
          });
        });

      });
    });

    describe('greaterThanOrEqual (>=)', function() {

      describe('integers', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThanOrEqual test';

        before(function(done) {
          var users = [];

          for(var i=40; i<44; i++) {
            users.push({ first_name: testName, age: i });
          }

          Queryable.User.createEach(users, function(err) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThanOrEqual key', function(done) {
          Queryable.User.find({ first_name: testName, age: { greaterThanOrEqual: 41 }}).sort('age').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 3);
            assert(users[0].age === 41);
            done();
          });
        });

        it('should return records with symbolic usage >= usage', function(done) {
          Queryable.User.find({ first_name: testName, age: { '>=': 41 }}).sort('age').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 3);
            assert(users[0].age === 41);
            done();
          });
        });
      });

      describe('dates', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThanOrEqual dates test';

        before(function(done) {
          // Insert 10 Users
          var users = [],
              date;

          for(var i=0; i<10; i++) {
            date = new Date(2013,10,1);
            date.setDate(date.getDate() + i);

            users.push({
              first_name: 'greaterThanOrEqual_dates_user' + i,
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThanOrEqual key when searching dates', function(done) {
          Queryable.User.find({ type: testName, dob: { greaterThanOrEqual: new Date(2013, 10, 9) }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 2);
            assert(users[0].first_name === 'greaterThanOrEqual_dates_user8');
            done();
          });
        });

        it('should return records with symbolic usage >= usage when searching dates', function(done) {
          Queryable.User.find({ type: testName, dob: { '>=': new Date(2013, 10, 9) }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 2);
            assert(users[0].first_name === 'greaterThanOrEqual_dates_user8');
            done();
          });
        });

      });

      describe('strings', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThanOrEqual strings test';

        before(function(done) {
          // Insert 10 Users
          var users = [],
              date;

          for(var i=0; i<10; i++) {
            users.push({
              first_name: i + ' greaterThanOrEqual_strings_user',
              type: testName,
              dob: date
            });
          }

          Queryable.User.createEach(users, function(err, users) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThanOrEqual key when searching strings', function(done) {
          Queryable.User.find({ type: testName, first_name: { greaterThanOrEqual: '2 greaterThanOrEqual_strings_user' }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 8);
            assert(users[0].first_name === '2 greaterThanOrEqual_strings_user');
            done();
          });
        });

        it('should return records with symbolic usage >= usage when searching strings', function(done) {
          Queryable.User.find({ type: testName, first_name: { '>=': '2 greaterThanOrEqual_strings_user' }}).sort('first_name').exec(function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 8);
            assert(users[0].first_name === '2 greaterThanOrEqual_strings_user');
            done();
          });
        });

      });
    });

  });
});
