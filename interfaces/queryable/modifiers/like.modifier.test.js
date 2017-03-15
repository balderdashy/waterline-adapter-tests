var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Modifiers', function() {
    describe('like', function() {
      it('should return the user with the given name', function(done) {
        var part = '%LIKE query test%';
        var testName = '24g LIKE query test asdcxbzbasg';

        Queryable.Userforqueryableinterface.create({ first_name: testName }, function(err) {
          if (err) {
            return done(err);
          }

          Queryable.Userforqueryableinterface.find({ 
            first_name: { 
              like: part 
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

      it('should support wrapping both sides with a % sign', function(done) {
        var part = 'LIKE query test with sign';
        var testName = '24gdddaga4 LIKE query test with sign asdcxbzbasg';

        Queryable.Userforqueryableinterface.create({ first_name: testName }, function(err) {
          if (err) {
            return done(err);
          }

          Queryable.Userforqueryableinterface.find({ 
            first_name: { 
              like: '%' + part + '%' 
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
