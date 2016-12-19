var assert = require('assert');
var _ = require('@sailshq/lodash'); 

describe('Association Interface', function() {
  describe('Has Many Through Association', function() {
    describe('.find', function() {
      var stadiumRecord; 
      var teamRecord;

      before(function(done) {
        Associations.Stadium.create({ name: 'hasManyThrough stadium'}, function(err, stadium) {
          if (err) {
            return done(err);
          }

          stadiumRecord = stadium;

          Associations.Team.create({ name: 'hasManyThrough team', mascot: 'elephant' }, function(err, team) {
            if (err) {
              return done(err);
            }

            teamRecord = team;

            Associations.Venue.create({ seats: 200, stadium: stadium.id, team: team.id }, function(err, venue) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it('should return teams when the populate criteria is added', function(done) {
        Associations.Stadium.find({ name: 'hasManyThrough stadium' })
        .populate('teams')
        .exec(function(err, stadiums) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(stadiums));
          assert.equal(stadiums.length, 1);
          assert(_.isArray(stadiums[0].teams));
          assert.equal(stadiums[0].teams.length, 1);

          return done();
        });
      });

      it('should not return a teams object when the populate is not added', function(done) {
        Associations.Stadium.find()
        .exec(function(err, stadiums) {
          if (err) {
            return done(err);
          }

          assert(!stadiums[0].teams);

          return done();
        });
      });
    });
  });
});
