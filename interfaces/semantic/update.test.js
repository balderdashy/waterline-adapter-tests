var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('.update()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Wipe database to ensure a clean result set
      Semantic.User.destroy(function(err) {
        if(err) return done(err);
        done();
      });

    });

    describe('attributes', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var id, thingId;

      before(function(done) {

        // Insert 10 Users
        var users = [];

        for(var i=0; i<10; i++) {
          users.push({first_name: 'update_user' + i, last_name: 'update', type: 'update'});
        }

        Semantic.User.createEach(users, function(err, users) {
          if(err) return done(err);
          id = users[0].id.toString();
          Semantic.Thing.create({ name: 'The Thing', description: 'A thing', age: 10 }, function(err, thing) {
            if(err) return done(err);
            thingId = thing.id;
            done();
          });
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should update model attributes', function(done) {
        Semantic.User.update({ type: 'update' }, { last_name: 'updated' }, function(err, users) {
          assert.ifError(err);
          assert(Array.isArray(users));
          assert.strictEqual(users.length, 10);
          assert.equal(users[0].last_name, 'updated');
          done();
        });
      });

      it('should return model instances', function(done) {
       Semantic. User.update({ type: 'update' }, { last_name: 'updated again' }).exec(function(err, users) {
          assert.ifError(err);
          assert(users[0].id);
          assert.strictEqual(users[0].first_name.indexOf('update_user'), 0);
          assert.equal(users[0].last_name, 'updated again');
          assert.equal(toString.call(users[0].createdAt), '[object Date]');
          assert.equal(toString.call(users[0].updatedAt), '[object Date]');
          done();
        });
      });

      it('should work with just an ID passed in', function(done) {
        Semantic.User.update(id, { first_name: 'foo' }).sort('first_name').exec(function(err, users) {
          assert.ifError(err);
          assert.equal(users[0].first_name, 'foo');
          done();
        });
      });

      it('should work with an empty object', function(done) {
        Semantic.User.update({}, { type: 'update all' }, function(err, users) {
          assert.ifError(err);
          assert.strictEqual(users.length, 10);
          assert.equal(users[0].type, 'update all');
          done();
        });
      });

      it('should work with null values', function(done) {
        Semantic.User.update(id, { age: null }, function(err, users) {
          assert.ifError(err);
          assert.strictEqual(users[0].age, null);
          done();
        });
      });
      
      it('should update model attributes without supplying required fields', function(done) {
        Semantic.Thing.update(thingId, { description: 'An updated thing' }, function(err, things) {
          assert.ifError(err);
          assert(Array.isArray(things));
          assert.strictEqual(things.length, 1);
          assert.equal(things[0].id, thingId);
          assert.equal(things[0].description, 'An updated thing');
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

        Semantic.User.createEach(users, function(err, users) {
          if(err) return done(err);

          // Update the 2 users
          Semantic.User.update({ type: 'updateFind' }, { last_name: 'Updated Find' }, function(err) {
            if(err) return done(err);
            done();
          });
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should allow the record to be found', function(done) {
        Semantic.User.find({ type: 'updateFind' }, function(err, users) {
          assert.ifError(err);
          assert.strictEqual(users.length, 2);
          assert.equal(users[0].last_name, 'Updated Find');
          assert.equal(users[1].last_name, 'Updated Find');
          done();
        });
      });
    });

  });
});
