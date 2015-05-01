var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('1:1 Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var users, profiles;

    before(function(done) {
      Associations.User_resource.createEach([{ name: 'foo1' }, { name: 'bar1' }], function(err, models) {
        if(err) return done(err);

        Associations.User_resource.find()
        .sort('id asc')
        .exec(function(err, models) {
          if(err) return done(err);

          users = models;

          var profileRecords = [
            { name: 'profile one', user: users[0].id },
            { name: 'profile two', user: users[1].id }
          ];

          Associations.Profile.createEach(profileRecords, function(err, models) {
            if(err) return done(err);

            Associations.User_resource.update({ name: 'foo1' }, { profile: models[0].id }).exec(function(err, user) {
              if(err) return done(err);

              Associations.User_resource.update({ name: 'bar1' }, { profile: models[1].id }).exec(function(err, user) {
                if(err) return done(err);
                profiles = models;
                done();
              });
            });
          });
        });
      });
    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return user when the populate criteria is added on profile', function(done) {
        Associations.Profile.find()
        .sort('id asc')
        .populate('user')
        .exec(function(err, profiles) {
          assert(!err);

          assert(profiles[0].user);
          assert(profiles[1].user);

          assert(profiles[0].user.name === 'foo1');
          assert(profiles[1].user.name === 'bar1');

          done();
        });
      });

      it('should return profile when the populate criteria is added on user', function(done) {
        Associations.User_resource.find()
        .populate('profile')
        .sort('id asc')
        .exec(function(err, users) {
          assert(!err);

          assert(users[0].profile);
          assert(users[1].profile);

          assert(users[0].profile.name === 'profile one');
          assert(users[1].profile.name === 'profile two');

          done();
        });
      });

      it('should return a user object when the profile is undefined', function(done) {
        Associations.User_resource.create({ name: 'foobar', profile: undefined }).exec(function(err, usr) {
          assert(!err, err);

          Associations.User_resource.find({ name: 'foobar' })
          .populate('profile')
          .exec(function(err, users) {
            assert(!err);
            assert(users[0].name);
            assert(!users[0].profile, 'Expected `users[0].profile` to be falsy, but instead users[0] looks like ==> '+require('util').inspect(users[0], false, null));
            done();
          });
        });
      });

      it('should return undefined for profile when the profile is a non-existent foreign key', function(done) {
        Associations.User_resource.create({ name: 'foobar2', profile: '123' }).exec(function(err, usr) {
          assert(!err, err);
          Associations.User_resource.find({ name: 'foobar2' })
          .populate('profile')
          .exec(function(err, users) {
            assert(!err);
            assert(users[0].name);
            assert(!users[0].profile, 'Expected `users[0].profile` to be falsy, but instead users[0] looks like ==> '+require('util').inspect(users[0], false, null));
            done();
          });
        });
      });

    });

  });
});
