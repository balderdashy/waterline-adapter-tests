var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('Nested Query Modifiers', function() {
    describe('with a record', function() {
      before(function(done) {

        // Insert 3 Users
        var users = [];

        // { first_name: 'nested_user1', last_name: 'smith', type: 'odd', age: 8 }
        // { first_name: 'nested_user2', last_name: 'smith', type: 'even', age: 7 }
        // { first_name: 'nested_user3', last_name: 'smith', type: 'odd', age: 6 }
        // { first_name: 'nested_user4', last_name: 'smith', type: 'even', age: 5 }
        // { first_name: 'nested_user5', last_name: 'jones', type: 'odd', age: 4 }
        // { first_name: 'nested_user6', last_name: 'jones', type: 'even', age: 3 }
        // { first_name: 'nested_user7', last_name: 'jones', type: 'odd', age: 2 }
        // { first_name: 'nested_user8', last_name: 'jones', type: 'even', age: 1 }

        for(var i=1; i<=8; i++) {
          users.push({
            first_name: 'nested_user' + i,
            last_name: i <= 4 ? 'smith' : 'jones',
            type: i % 2 ? 'odd' : 'even',
            age: 9 - i
          });
        }

        Queryable.Userforqueryableinterface.createEach(users, function(err, users) {

          if (err) {
            return done(err);
          }

          return done();
        });
      });

      it('should return the correct users with nested criteria', function(done) {
        // Find all users who either:
        // + Have the last name smith, and age <= 7 OR type === "even"
        // + Have the last name jones, and type === "odd" OR ( first name contains "6" AND age = 1 or age < 2 )
        // ( (last_name = "smith" AND (age <=7 OR type = "even")) OR (last_name = "jones" AND (type = "odd" OR ( first_name like "%6%" AND ( age = 1 OR age < 2 ) ) ) ) )
        Queryable.Userforqueryableinterface.find({
          where: {
            or: [
              {
                and: [
                  { last_name: 'smith' },
                  { or:
                    [
                      { age: { '<=': 7 } },
                      { type: 'even' }
                    ]
                  }
                ]
              },
              {
                and: [
                  { last_name: 'jones' },
                  {
                    or: [
                      { type: 'odd' },
                      // { first_name: {contains: '6'}}
                      { and: [
                          { first_name: { contains: '6' } },
                          { or: [
                              { age: 3 },
                              { age: { '<': 4} }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        })
        .sort([{first_name: 'desc'}])
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          // Expected results:
          // { first_name: 'nested_user2', last_name: 'smith', type: 'even', age: 7 }
          // { first_name: 'nested_user3', last_name: 'smith', type: 'odd', age: 6 }
          // { first_name: 'nested_user4', last_name: 'smith', type: 'even', age: 5 }
          // { first_name: 'nested_user5', last_name: 'jones', type: 'odd', age: 4 }
          // { first_name: 'nested_user6', last_name: 'jones', type: 'even', age: 3 }
          // { first_name: 'nested_user7', last_name: 'jones', type: 'odd', age: 2 }
          assert(_.isArray(users));
          assert.strictEqual(users.length, 6);
          assert.equal(users[0].first_name, 'nested_user7');
          assert.equal(users[1].first_name, 'nested_user6');
          assert.equal(users[2].first_name, 'nested_user5');
          assert.equal(users[3].first_name, 'nested_user4');
          assert.equal(users[4].first_name, 'nested_user3');
          assert.equal(users[5].first_name, 'nested_user2');

          return done();
        });
      });

      it('should remove unnecessary conjuncts and disjuncts correcty', function(done) {
        Queryable.Userforqueryableinterface.find({
          and: [
              {last_name: ["smith"]},
              {type: ["even"]},
              {},
              {},
              {first_name: ["nested_user2"]},
          ]
        }).exec(function(err, users) {
          if (err) {
            return done(err);
          }

          // Expected results:
          // { first_name: 'nested_user2', last_name: 'smith', type: 'even', age: 7 }
          assert(_.isArray(users));
          assert.strictEqual(users.length, 1);
          assert.equal(users[0].first_name, 'nested_user2');
          return done();
        });
      });
    });
  });
});
