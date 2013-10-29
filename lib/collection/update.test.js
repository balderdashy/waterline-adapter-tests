var Model = require('../fixtures/crud'),
    ModelPK = require('../fixtures/customPrimaryKey'),
    assert = require('assert');

describe('Collection', function() {

  describe('.update()', function() {
    var User;

    before(function(done) {
      User = new Model({ adapters: { test: Adapter }}, function(err) {
        if(err) return done(err);
        done();
      });
    });

    describe('with crud fixture', function() {

      before(function(done) {

        // Wipe database to ensure a clean result set
        User.destroy(function(err) {
          if(err) return done(err);
          done();
        });

      });

      describe('attributes', function() {
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

        // Create users to test updates on
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


    describe('with custom primary key settings', function() {
      var Factory;

      before(function(done) {
        Factory = new ModelPK({ adapters: { test: Adapter }}, function(err) {
          if(err) return done(err);
          done();
        });
      });

      describe('mapping update criteria values', function() {
        var record;

        // Insert a Record to update
        before(function(done) {

          var documents = [
            { title: 'custom-primary-key', number: 28 },
            { title: 'custom-primary-key-2', number: 29 }
          ];

          Factory.createEach(documents, function(err, record) {
            if(err) return done(err);
            record = record;
            done();
          });
        });

        it('should update correct record', function(done) {
          Factory.update({ number: 28 }, { number: 30 }).exec(function(err, records) {
            if(err) return done(err);
            assert(records.length === 1);
            assert(records[0].number === 30);
            done();
          });
        });
      });
    });

  });
});
