var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Through Association', function() {
    describe('projections', function() {
      var stadium;
      var team;

      before(function(done) {
        Associations.Stadium.create({ name: 'hasManyThrough stadium'}, function(err, _stadium) {
          if (err) {
            return done(err);
          }

          stadium = _stadium;

          Associations.Team.create({ name: 'hasManyThrough team', mascot: 'elephant' }, function(err, _team) {
            if (err) {
              return done(err);
            }

            team = _team;

            Associations.Venue.create({ seats: 200, stadium: _stadium.id, team: _team.id }, function(err, venue) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it.skip('should filter populated attributes when projections are used', function(done) {
        Associations.Stadium.findOne({ id: stadium.id })
        .populate('teams', { select: ['name'] })
        .exec(function(err, data) {
          if (err) {
            return done(err);
          }

          assert(data);
          assert(_.isArray(data.teams));
          assert.equal(data.teams.length, 1);

          assert.equal(_.keys(data.teams[0]).length, 2);
          assert(data.teams[0].id);
          assert.equal(data.teams[0].name, team.name);
          
          return done();
        });
      });
    });
  });
});
