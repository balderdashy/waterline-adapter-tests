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

    describe('lessThan (<)', function() {
      var testName = 'lessThan test';

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

      it('should return records with lessThan key', function(done) {
        User.find({ first_name: testName, age: { lessThan: 42 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].age === 40);
          done();
        });
      });

      it('should return records with symbolic usage < usage', function(done) {
        User.find({ first_name: testName, age: { '<': 42 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].age === 40);
          done();
        });
      });
    });

    describe('lessThanOrEqual (<=)', function() {
      var testName = 'lessThanOrEqual test';

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

      it('should return records with lessThanOrEqual key', function(done) {
        User.find({ first_name: testName, age: { lessThanOrEqual: 42 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 40);
          done();
        });
      });

      it('should return records with symbolic usage <= usage', function(done) {
        User.find({ first_name: testName, age: { '<=': 42 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 40);
          done();
        });
      });
    });

  });
});
