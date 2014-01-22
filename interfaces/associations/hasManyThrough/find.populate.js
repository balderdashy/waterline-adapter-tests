var Waterline = require('waterline'),
    stadiumFixture = require('../support/hasManyThrough.stadium.fixture'),
    teamFixture = require('../support/hasManyThrough.team.fixture'),
    venueFixture = require('../support/hasManyThrough.venue.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Stadium, Team, Venue, waterline;

  before(function(done) {
    waterline = new Waterline();

    waterline.loadCollection(stadiumFixture);
    waterline.loadCollection(teamFixture);
    waterline.loadCollection(venueFixture);

    Events.emit('fixture', stadiumFixture);
    Events.emit('fixture', teamFixture);
    Events.emit('fixture', venueFixture);

    Connections.associations = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);

      Stadium = colls.collections.stadium;
      Team = colls.collections.team;
      Venue = colls.collections.venue;

      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });


  describe('Has Many Through Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var stadiumRecord, teamRecord;

    before(function(done) {
      Stadium.create({ name: 'hasManyThrough stadium'}, function(err, stadium) {
        if(err) return done(err);
        stadiumRecord = stadium;

        Team.create({ name: 'hasManyThrough team', mascot: 'elephant' }, function(err, team) {
          if(err) return done(err);
          teamRecord = team;

          Venue.create({ seats: 200, stadium: stadium.id, team: team.id }, function(err, venue) {
            if(err) return done(err);
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return teams when the populate criteria is added', function(done) {
        Stadium.find({ name: 'hasManyThrough stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          if(err) return done(err);

          assert(Array.isArray(stadiums));
          assert(stadiums.length === 1);
          assert(Array.isArray(stadiums[0].teams));
          assert(stadiums[0].teams.length === 1);

          done();
        });
      });

      it('should not return a teams object when the populate is not added', function(done) {
        Stadium.find()
        .exec(function(err, stadiums) {
          if(err) return done(err);

          var obj = stadiums[0].toJSON();
          assert(!obj.teams);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Stadium.find({ name: 'hasManyThrough stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          if(err) return done(err);

          var obj = stadiums[0].toJSON();

          assert(Array.isArray(obj.teams));
          assert(obj.teams.length === 1);
          assert(!obj.teams[0].mascot);

          done();
        });
      });

    });
  });
});
