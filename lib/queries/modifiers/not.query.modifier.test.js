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

    describe('not (!)', function() {
      var testName = 'not ! test';

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

      it('should return records with string usage', function(done) {
        User.find({ first_name: testName, age: { not: 40 }}, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);

          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // TODO: check that models without the attribute in question set AT ALL,
          //        should still be returned, since their "age" is not equal to 40 (they are ageless)
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          done();
        });
      });

      it('should return records with symbolic usage ! usage', function(done) {
        User.find({ first_name: testName, age: { '!': 40 }}, function(err, users) {
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
