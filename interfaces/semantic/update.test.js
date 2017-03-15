var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.update()', function() {
    before(function(done) {
      // Wipe database to ensure a clean result set
      Semantic.User.destroy({}, function(err) {
        if(err) { return done(err); }
        return done();
      });
    });

    describe('attributes', function() {
      var id;
      var thingId;

      before(function(done) {
        // Insert 10 Users
        var users = [];

        for(var i=0; i<10; i++) {
          users.push({first_name: 'update_user' + i, last_name: 'update', type: 'update'});
        }

        Semantic.User.createEach(users, function(err, users) {
          if (err) {
            return done(err);
          }

          id = users[0].id.toString();

          Semantic.Thing.create({ name: 'The Thing', description: 'A thing', age: 10 }, function(err, thing) {
            if (err) {
              return done(err);
            }

            thingId = thing.id;

            return done();
          });
        });
      });


      it('should update attribute values', function(done) {
        Semantic.User.update({ type: 'update' })
        .set({ last_name: 'updated' })
        .exec(function(err, users) {
          if (err) { return done(err); }

          try {
            assert(_.isArray(users));
            assert.strictEqual(users.length, 10);
            assert.equal(users[0].last_name, 'updated');
          } catch (e) { return done(e); }

          return done();
        });
      });

      it('should return generated timestamps', function(done) {
       Semantic.User.update({ type: 'update' }, { last_name: 'updated again' }).exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(users[0].id);
          assert.strictEqual(users[0].first_name.indexOf('update_user'), 0);
          assert.equal(users[0].last_name, 'updated again');
          assert(users[0].createdAt);
          assert(users[0].updatedAt);

          return done();
        });
      });

      it('should work with just an ID passed in', function(done) {
        Semantic.User.update(id, { first_name: 'foo' })
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert.equal(users.length, 1);
          assert.equal(users[0].first_name, 'foo');

          return done();
        });
      });

      it('should work with an empty dictionary', function(done) {
        Semantic.User.update({}, { type: 'update all' }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 10);
          assert.equal(users[0].type, 'update all');

          return done();
        });
      });

      it('should work with null values', function(done) {
        Semantic.User.update(id, { age: null }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users[0].age, null);

          return done();
        });
      });


      var allowsMutatingPkValues = (Adapter.identity === 'sails-mongo') ? true : false;
      // ^FUTURE: Standardize this to allow flexibility for other databases.
      // (Mongo does not allow the `_id` field to be mutated.)

      if (allowsMutatingPkValues) {
        it.skip('should work when changing a user\'s primary key value');
      }
      else {
        it('should work when changing a user\'s primary key value', function(done) {


          var newPkValue = (Adapter.identity === 'sails-mongo') ? '58c955bc3159b4b091a74046' : 99999;
          Semantic.User.update(id, {
            id: newPkValue,
            type: 'had his or her pk value successfully changed'
          }, function(err, users) {
            if (err) { return done(err); }

            assert.strictEqual(users.length, 1);
            assert.strictEqual(users[0].id, newPkValue);
            assert.strictEqual(users[0].type, 'had his or her pk value successfully changed');

            return done();
          });
        });//</it()>
      }//</else>

      it('should update attribute values without supplying required fields', function(done) {
        Semantic.Thing.update(thingId, { description: 'An updated thing' }, function(err, things) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(things));
          assert.strictEqual(things.length, 1);
          assert.equal(things[0].id, thingId);
          assert.equal(things[0].description, 'An updated thing');

          return done();
        });
      });
    });//</describe>

    describe('find updated records', function() {
      before(function(done) {
        // Insert 2 Users
        var users = [];

        for(var i=0; i<2; i++) {
          users.push({first_name: 'update_find_user' + i, last_name: 'update', type: 'updateFind'});
        }

        Semantic.User.createEach(users, function(err, users) {
          if (err) {
            return done(err);
          }

          // Update the 2 users
          Semantic.User.update({ type: 'updateFind' }, { last_name: 'Updated Find' }, function(err) {
            if (err) {
              return done(err);
            }

            done();
          });
        });
      });


      it('should allow the record to be found', function(done) {
        Semantic.User.find({ type: 'updateFind' }, function(err, users) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(users.length, 2);
          assert.equal(users[0].last_name, 'Updated Find');
          assert.equal(users[1].last_name, 'Updated Find');

          return done();
        });
      });
    });
  });
});
