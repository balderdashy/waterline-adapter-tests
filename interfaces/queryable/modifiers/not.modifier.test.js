var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {

    describe('not (!)', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = 'not ! test';

      before(function(done) {
        var users = [];

        for(var i=40; i<44; i++) {
          users.push({ first_name: testName, age: i, email: i + '@test.com' });
        }

        Queryable.User.createEach(users, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return records with string usage', function(done) {
        Queryable.User.find({ first_name: testName, age: { not: 40 }})
        .sort('id asc')
        .exec(function(err, users) {
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
        Queryable.User.find({ first_name: testName, age: { '!': 40 }})
        .sort('id asc')
        .exec(function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 41);
          done();
        });
      });

      it('should return records using not comparisons on strings', function(done) {
        Queryable.User.find({ first_name: testName, email: { '!': '41@test.com' }})
        .sort('id asc')
        .exec(function(err, users) {
          assert(!err);

          assert(Array.isArray(users));
          assert(users.length === 3);
          assert(users[0].age === 40);
          assert(users[1].age === 42);
          done();
        });
      });
    });

  });
});
