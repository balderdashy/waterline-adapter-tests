var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('OR Query Modifier', function() {
    describe('with a record', function() {
      before(function(done) {

        // Insert 3 Users
        var users = [];

        for(var i=0; i<4; i++) {
          users.push({
            first_name: 'OR_user' + i,
            last_name: 'contains_user' + i,
            type: 'or test',
            age: i
          });
        }

        Queryable.User.createEach(users, function(err, users) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });

      it('should return the correct users', function(done) {
        Queryable.User.find({ 
          where: { 
            or: [
              { 
                first_name: 'OR_user0' 
              }, 
              { 
                first_name: 'OR_user1' 
              }
            ]
          }
        })
        .sort([{first_name: 'asc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(users));
          assert.strictEqual(users.length, 2);
          assert.equal(users[0].first_name, 'OR_user0');
          assert.equal(users[1].first_name, 'OR_user1');
          
          return done();
        });
      });

      it('should work with multi-level criteria options inside the OR criteria', function(done) {
        Queryable.User.find({
          or: [
            { 
              first_name: { 
                like: '%user0%' 
              }, 
              type: 'or test' 
            },
            { 
              first_name: { 
                like: '%user1' 
              }, 
              age: { 
                '>': 0 
              }, 
              type: 'or test' 
            }
          ]
        })
        .sort([{first_name: 'asc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(users));
          assert.strictEqual(users.length, 2);
          assert.equal(users[0].first_name, 'OR_user0');
          assert.equal(users[1].first_name, 'OR_user1');
          
          return done();
        });
      });

      it('should work correctly when OR is used with AND', function(done) {
        Queryable.User.find({
          type: 'or test',
          or: [
            { 
              first_name: { 
                like: '%user1%' 
              } 
            },
            { 
              first_name: { 
                like: '%user2' 
              } 
            }
          ]
        })
        .sort([{first_name: 'asc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(users));
          assert.strictEqual(users.length, 2);
          assert.equal(users[0].first_name, 'OR_user1');
          assert.equal(users[1].first_name, 'OR_user2');
          
          return done();
        });
      });

      it('should work correctly when OR is used with multiple contains modifiers', function(done) {
        Queryable.User.find({
          type: 'or test',
          or: [
            { 
              first_name: { 
                like: '%user0%' 
              } 
            },
            { 
              last_name:  { 
                like: '%user1%' 
              } 
            }
          ]
        })
        .sort([{first_name: 'asc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(users));
          assert.strictEqual(users.length, 2);
          assert.equal(users[0].first_name, 'OR_user0');
          assert.equal(users[1].last_name, 'contains_user1');
          
          return done();
        });
      });
    });

    describe('without a record', function() {
      it('should return an empty array', function(done) {
        Queryable.User.find({ 
          where: { 
            or: [
              { 
                first_name: 'OR_user10' 
              }, 
              { 
                first_name: 'OR_user11' 
              }
            ]
          }
        })
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 0);
          
          return done();
        });
      });
    });
  });
});
