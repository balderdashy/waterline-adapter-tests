var Waterline = require('waterline'),
    UserFixture = require('../support/oneToOne.fixture').user_resource,
    ProfileFixture = require('../support/oneToOne.fixture').profile,
    _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User, Profile, waterline;

  before(function(done) {
    waterline = new Waterline();

    waterline.loadCollection(UserFixture);
    waterline.loadCollection(ProfileFixture);

    Events.emit('fixture', UserFixture);
    Events.emit('fixture', ProfileFixture);

    Connections.associations = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);

      User = colls.collections.user_resource;
      Profile = colls.collections.profile;

      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('One to One Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var users, profiles;

    before(function(done) {
      User.createEach([{ name: 'foo', profile: 1 }, { name: 'bar', profile: 2 }], function(err, models) {
        if(err) return done(err);

        users = models;

        var profileRecords = [
          { name: 'profile one', user: users[0].id },
          { name: 'profile two', user: users[1].id }
        ];

        Profile.createEach(profileRecords, function(err, models) {
          if(err) return done(err);
          profiles = models;
          done();
        });
      });
    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return user when the populate criteria is added on profile', function(done) {
        Profile.find()
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
        User.find()
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
        User.create({ name: 'foobar', profile: null }).exec(function(err) {
          if(err) return done(err);

          User.find({ name: 'foobar' })
          .populate('profile')
          .exec(function(err, users) {
            if(err) return cb(err);

            assert(users[0].name);
            assert(!users[0].profile);
            done();
          });
        });
      });

    });

  });
});
