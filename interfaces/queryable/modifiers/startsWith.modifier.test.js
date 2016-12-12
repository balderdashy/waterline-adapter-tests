var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe.skip('startsWith', function() {
      it('should return the user with the correct name', function(done) {
        var part = 'long_xxj8xrxh!!!r';
        var testName = 'long_xxj8xrxh!!!r startsWith query test';

        Queryable.User.create({ first_name: testName }, function(err) {
          if (err) {
            return done(err);
          }

          Queryable.User.where({ 
            first_name: { 
              startsWith: part 
            }
          })
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(users));
            assert.equal(users.length, 1);
            assert.equal(users[0].first_name, testName);
            
            return done();
          });
        });
      });
    });
  });
});
