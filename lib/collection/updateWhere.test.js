var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Collection', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.updateAll()', function() {

    describe('attributes', function() {

      before(function(done) {

        // Insert 10 Users
        var users = [];

        for(var i=0; i<10; i++) {
          users.push({first_name: 'updateWhere_user' + i, last_name: 'update', type: 'updateWhere'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);
          done();
        });
      });

      it('should update model attributes', function(done) {
        User.updateWhere({ type: 'updateWhere' }, { last_name: 'updated' }, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 10);
          assert(users[0].last_name === 'updated');
          done();
        });
      });

      it('should return model instances', function(done) {
        User.updateWhere({ type: 'updateWhere' }, { last_name: 'updated again' }, function(err, users) {
          assert(!err);
          assert(users[0].id);
          assert(users[0].fullName() === 'updateWhere_user0 updated again');
          assert(toString.call(users[0].createdAt) == '[object Date]');
          assert(toString.call(users[0].updatedAt) == '[object Date]');
          done();
        });
      });
    });

    describe('find updated records', function() {

      // Create users to test updates on
      before(function(done) {

        // Insert 2 Users
        var users = [];

        for(var i=0; i<2; i++) {
          users.push({first_name: 'updateWhere_find_user' + i, last_name: 'update', type: 'updateWhereFind'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);

          // Update the 2 users
          User.updateWhere({ type: 'updateWhereFind' }, { last_name: 'Updated Find' }, function(err) {
            if(err) return done(err);
            done();
          });
        });
      });

      it('should allow the record to be found', function(done) {
        User.findAll({ type: 'updateWhereFind' }, function(err, users) {
          assert(!err);
          assert(users.length === 2);
          assert(users[0].last_name === 'Updated Find');
          assert(users[1].last_name === 'Updated Find');
          done();
        });
      });
    });

  });
});
