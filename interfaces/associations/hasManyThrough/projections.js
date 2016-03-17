var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Through Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var stadium, team;

    before(function(done) {
      Associations.Stadium.create({ name: 'hasManyThrough stadium'}, function(err, _stadium) {
        if(err) return done(err);
        stadium = _stadium;

        Associations.Team.create({ name: 'hasManyThrough team', mascot: 'elephant' }, function(err, _team) {
          if(err) return done(err);
          team = _team;

          Associations.Venue.create({ seats: 200, stadium: _stadium.id, team: _team.id }, function(err, venue) {
            if(err) return done(err);
            done();
          });
        });
      });
    });

    describe('projections', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should filter populated attributes when projections are used', function(done) {
        Associations.Stadium.findOne({ id: stadium.id })
        .populate('teams', { select: ['name'] })
        .exec(function(err, data) {
          assert.ifError(err);
          assert(data);
          assert(_.isArray(data.teams));
          assert.equal(data.teams.length, 1);

          // JSON stringify the record to remove any virtual functions such
          // as associations with .add/.remove
          var record = data.toJSON();

          assert.equal(_.keys(record.teams[0]).length, 2);
          assert(record.teams[0].id);
          assert.equal(record.teams[0].name, team.name);
          done();
        });
      });

    });
  });
});
