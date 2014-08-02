var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('OR Query Modifier', function() {

    describe('with a record', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        // Insert 3 Users
        var users = [];

        for(var i=0; i<3; i++) {
          users.push({first_name: 'OR_user' + i, type: 'or test', age: i });
        }

        Queryable.User.createEach(users, function(err, users) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return the correct users', function(done) {
        Queryable.User.find({ where: { or: [{ first_name: 'OR_user0' }, { first_name: 'OR_user1' }]}})
        .sort('first_name')
        .exec(function(err, users) {
          if(err) return done(err);

          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].first_name === 'OR_user0');
          assert(users[1].first_name === 'OR_user1');
          done();
        });
      });

      it('should return a model instances', function(done) {
        Queryable.User.find({ where: { or: [{ first_name: 'OR_user0' }, { first_name: 'OR_user1' }]}})
        .exec(function(err, users) {
          assert(users[0].id);
          assert(typeof users[0].fullName === 'function');
          assert(toString.call(users[0].createdAt) == '[object Date]');
          assert(toString.call(users[0].updatedAt) == '[object Date]');
          done();
        });
      });

      it('should work with multi-level criteria options inside the OR criteria', function(done) {
        Queryable.User.find({
          or: [
            { first_name: { contains: 'user0' }, type: 'or test' },
            { first_name: { endsWith: 'user1' }, age: { '>': 0 }, type: 'or test' }
          ]
        })
        .sort('first_name')
        .exec(function(err, users) {
          if(err) return done(err);

          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].first_name === 'OR_user0');
          assert(users[1].first_name === 'OR_user1');
          done();
        });
      });

      it('should work correctly when OR is used with AND', function(done) {
        Queryable.User.find({
          type: 'or test',
          or: [
            { first_name: { contains: 'user1' } },
            { first_name: { endsWith: 'user2' } }
          ]
        })
        .sort('first_name')
        .exec(function(err, users) {
          if(err) return done(err);

          assert(Array.isArray(users));
          assert(users.length === 2);
          assert(users[0].first_name === 'OR_user1');
          assert(users[1].first_name === 'OR_user2');
          done();
        });
      });
    });

    describe('without a record', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return an empty array', function(done) {
        Queryable.User.find({ where: { or: [{ first_name: 'OR_user10' }, { first_name: 'OR_user11' }]}})
        .exec(function(err, users) {
          assert(users.length === 0);
          done();
        });
      });
    });

  });
});
