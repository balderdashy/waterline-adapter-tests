var Waterline = require('waterline'),
    stadiumFixture = require('../support/hasManyThrough.stadium.fixture'),
    teamFixture = require('../support/hasManyThrough.team.fixture'),
    venueFixture = require('../support/hasManyThrough.venue.fixture'),
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Stadium, Team, Venue;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(stadiumFixture);
    waterline.loadCollection(teamFixture);
    waterline.loadCollection(venueFixture);

    Events.emit('fixture', stadiumFixture);
    Events.emit('fixture', teamFixture);
    Events.emit('fixture', venueFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Stadium = collections.stadium;
      Team = collections.team;
      Venue = collections.venue;

      done();
    });
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

        Team.create({ name: 'hasManyThrough team' }, function(err, team) {
          if(err) return done(err);
          teamRecord = team;

          Venue.create({ seats: 200, stadium: stadium.id, team: team.id }, function(err, venue) {
            console.log(err);
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

      it.only('should return teams when the populate criteria is added', function(done) {
        Stadium.find({ name: 'hasManyThrough stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          if(err) return done();

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

    });
  });
});
