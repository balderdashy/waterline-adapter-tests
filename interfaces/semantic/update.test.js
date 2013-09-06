var Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.update()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Wipe database to ensure a clean result set
      User.destroy(function(err) {
        if(err) return done(err);
        done();
      });

    });

    describe('attributes', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var id;

      before(function(done) {

        // Insert 10 Users
        var users = [];

        for(var i=0; i<10; i++) {
          users.push({first_name: 'update_user' + i, last_name: 'update', type: 'update'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);
          id = users[0].id.toString();
          done();
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should update model attributes', function(done) {
        User.update({ type: 'update' }, { last_name: 'updated' }, function(err, users) {
          assert(!err);
          assert(Array.isArray(users));
          assert(users.length === 10);
          assert(users[0].last_name === 'updated');
          done();
        });
      });

      it('should return model instances', function(done) {
        User.update({ type: 'update' }, { last_name: 'updated again' }, function(err, users) {
          assert(!err);
          assert(users[0].id);
          assert(users[0].fullName() === 'update_user0 updated again');
          assert(toString.call(users[0].createdAt) == '[object Date]');
          assert(toString.call(users[0].updatedAt) == '[object Date]');
          done();
        });
      });

      it('should work with just an ID passed in', function(done) {
        User.update(id, { first_name: 'foo' }, function(err, users) {
          assert(!err);
          assert(users[0].first_name === 'foo');
          done();
        });
      });

      it('should work with an empty object', function(done) {
        User.update({}, { type: 'update all' }, function(err, users) {
          assert(!err);
          assert(users.length === 10);
          assert(users[0].type === 'update all');
          done();
        });
      });
    });

    describe('find updated records', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        // Insert 2 Users
        var users = [];

        for(var i=0; i<2; i++) {
          users.push({first_name: 'update_find_user' + i, last_name: 'update', type: 'updateFind'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);

          // Update the 2 users
          User.update({ type: 'updateFind' }, { last_name: 'Updated Find' }, function(err) {
            if(err) return done(err);
            done();
          });
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should allow the record to be found', function(done) {
        User.find({ type: 'updateFind' }, function(err, users) {
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
