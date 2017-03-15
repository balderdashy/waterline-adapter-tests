var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe('not equal (!=)', function() {
      var testName = 'not != test';

      before(function(done) {
        var users = [];

        for(var i=40; i<44; i++) {
          users.push({ first_name: testName, age: i, email: i + '@test.com' });
        }

        Queryable.Userforqueryableinterface.createEach(users, function(err) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });

      it('should return records with symbolic usage ! usage', function(done) {
        Queryable.Userforqueryableinterface.find({ first_name: testName, age: { '!=': 40 }})
        .sort([{age: 'asc'}])
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

      it('should return records using not comparisons on strings', function(done) {
        Queryable.Userforqueryableinterface.find({ first_name: testName, email: { '!=': '41@test.com' }})
        .sort([{age: 'asc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(users));
          assert.strictEqual(users.length, 3);
          assert.strictEqual(users[0].age, 40);
          assert.strictEqual(users[1].age, 42);
          
          return done();
        });
      });
    });
  });
});
