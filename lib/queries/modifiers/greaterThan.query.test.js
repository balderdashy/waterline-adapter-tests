var Model = require('../../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('Modifiers', function() {

    describe('greaterThan (>)', function() {
      var testName = 'greaterThan test';

      before(function(done) {
        var users = [];

        for(var i=40; i<44; i++) {
          users.push({ first_name: testName, age: i });
        }

        User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      it('should return records with greaterThan key', function(done) {
        User.find({ first_name: testName, age: { greaterThan: 40 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });

      it('should return records with symbolic usage > usage', function(done) {
        User.find({ first_name: testName, age: { '>': 40 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });
    });

    describe('greaterThanOrEqual (>=)', function() {
      var testName = 'greaterThanOrEqual test';

      before(function(done) {
        var users = [];

        for(var i=40; i<44; i++) {
          users.push({ first_name: testName, age: i });
        }

        User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      it('should return records with greaterThanOrEqual key', function(done) {
        User.find({ first_name: testName, age: { greaterThanOrEqual: 41 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });

      it('should return records with symbolic usage >= usage', function(done) {
        User.find({ first_name: testName, age: { '>=': 41 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });
    });

  });
});
