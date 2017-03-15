var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('1:1 Association', function() {
    describe('.find()', function() {
      var users;
      var profiles;

      before(function(done) {
        var records = [
          {
            name: 'foo1',
            quantity : 1
          },
          {
            name: 'bar1',
            quantity : 2
          }
        ];

        Associations.User_resource.createEach(records, function(err, models) {
          if (err) {
            return done(err);
          }

          Associations.User_resource.find()
          .sort('quantity asc')
          .exec(function(err, models) {
            if (err) {
              return done(err);
            }

            users = models;

            var profileRecords = [
              { name: 'profile one', user: users[0].id, level : 1 },
              { name: 'profile two', user: users[1].id, level : 2 }
            ];

            Associations.Profile.createEach(profileRecords, function(err, models) {
              if (err) {
                return done(err);
              }

              Associations.User_resource.update({ name: 'foo1' }, { profile: models[0].id })
              .exec(function(err, user) {
                if (err) {
                  return done(err);
                }

                Associations.User_resource.update({ name: 'bar1' }, { profile: models[1].id })
                .exec(function(err, user) {
                  if (err) {
                    return done(err);
                  }

                  profiles = models;

                  return done();
                });
              });
            });
          });
        });
      });

      it('should return user when the populate criteria is added on profile', function(done) {
        Associations.Profile.find()
        .sort('level asc')
        .populate('user')
        .exec(function(err, profiles) {
          if (err) {
            return done(err);
          }

          assert(profiles[0].user);
          assert(profiles[1].user);

          assert.equal(profiles[0].user.name, 'foo1');
          assert.equal(profiles[1].user.name, 'bar1');

          return done();
        });
      });

      it('should return profile when the populate criteria is added on user', function(done) {
        Associations.User_resource.find()
        .populate('profile')
        .sort('quantity asc')
        .exec(function(err, users) {
          if (err) {
            return done(err);
          }

          assert(users[0].profile);
          assert(users[1].profile);

          assert.equal(users[0].profile.name, 'profile one');
          assert.equal(users[1].profile.name, 'profile two');

          return done();
        });
      });

      it('should still return a user record, but with a null profile, when the foreign key is missing altogether', function(done) {
        // Also could have omitted it or specified it as `null`
        Associations.User_resource.create({ name: 'foobar', profile: undefined })
        .exec(function(err, usr) {
          if (err) { return done(err); }

          Associations.User_resource.find({ name: 'foobar' })
          .populate('profile')
          .exec(function(err, users) {
            if (err) { return done(err); }

            try {
              assert.strictEqual(users.length, 1);
              assert(users[0].name === 'foobar');
              assert(_.isNull(users[0].profile));
            } catch (e) { return done(e); }

            return done();
          });
        });
      });

      it('should still return a user record, but with a null profile, when the foreign key points at a non-existent profile', function(done) {

        var fkForNonExistentRecord;
        if (Adapter.identity === 'sails-mongo') {
          fkForNonExistentRecord = '58c955bc3159b4b091a74046';
        }
        else {
          fkForNonExistentRecord = '123';
        }

        Associations.User_resource.create({
          name: 'foobar2',
          profile: fkForNonExistentRecord
        })
        .exec(function(err, usr) {
          if (err) {
            return done(err);
          }

          Associations.User_resource.find({ name: 'foobar2' })
          .populate('profile')
          .exec(function(err, users) {
            if (err) {
              return done(err);
            }

            try {
              assert(users[0].name === 'foobar2');
              assert(_.isNull(users[0].profile));
            } catch (e) { return done(e); }

            return done();
          });
        });
      });
    });
  });
});
