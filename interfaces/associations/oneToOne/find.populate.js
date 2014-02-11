var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('1:1 Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var users, profiles;

    before(function(done) {
      Associations.User_resource.createEach([{ name: 'foo' }, { name: 'bar' }], function(err, models) {
        if(err) return done(err);

        users = models;

        var profileRecords = [
          { name: 'profile one', user: users[0].id },
          { name: 'profile two', user: users[1].id }
        ];

        Associations.Profile.createEach(profileRecords, function(err, models) {
          if(err) return done(err);

          Associations.User_resource.update({ name: 'foo' }, { profile: models[0].id }).exec(function(err, user) {
            if(err) return done(err);

            Associations.User_resource.update({ name: 'bar' }, { profile: models[1].id }).exec(function(err, user) {
              if(err) return done(err);
              profiles = models;
              done();
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
        .populate('user')
        .exec(function(err, profiles) {
          if(err) return done(err);

          assert(profiles[0].user);
          assert(profiles[1].user);

          assert(profiles[0].user.name === 'foo');
          assert(profiles[1].user.name === 'bar');

          done();
        });
      });

      it('should return profile when the populate criteria is added on user', function(done) {
        Associations.User_resource.find()
        .populate('profile')
        .exec(function(err, users) {
          if(err) return done(err);

          assert(users[0].profile);
          assert(users[1].profile);

          assert(users[0].profile.name === 'profile one');
          assert(users[1].profile.name === 'profile two');

          done();
        });
      });

      it('should return a user object when the profile is undefined', function(done) {
        Associations.User_resource.create({ name: 'foobar', profile: undefined }).exec(function(err, usr) {
          if(err) return done(err);

          Associations.User_resource.find({ name: 'foobar' })
          .populate('profile')
          .exec(function(err, users) {
            if(err) return done(err);

            assert(users[0].name);
            assert(!users[0].profile);
            done();
          });
        });
      });

    });

  });
});
