var assert = require('assert');
var _ = require('@sailshq/lodash'); 

describe('Association Interface', function() {
  describe('Has Many Through Association', function() {
    describe('.find', function() {
      var stadiumRecord; 
      var teamRecord;

      before(function(done) {
        Associations.Stadium.create({ name: 'hasManyThrough nested stadium'}, function(err, stadium) {
          if (err) {
            return done(err);
          }

          stadiumRecord = stadium;

          var childRecords = [];
          // { wins: 1, mascot: 'odd', name: 'low' },
          // { wins: 2, mascot: 'even', name: 'low' },
          // { wins: 3, mascot: 'odd', name: 'low' },
          // { wins: 4, mascot: 'even', name: 'low' },
          // { wins: 5, mascot: 'odd', name: 'high' },
          // { wins: 6, mascot: 'even', name: 'high' },
          // { wins: 7, mascot: 'odd', name: 'high' },
          // { wins: 8, mascot: 'even', name: 'high' },

          for(var i=1; i<=8; i++) {
            childRecords.push({
              wins: i,
              name: i <= 4 ? 'low' : 'high',
              mascot: i % 2 ? 'odd' : 'even'
            });
          }

          Associations.Team.createEach(childRecords).exec(function(err, teams) {
            if (err) {
              return done(err);
            }

            var linkRecords = _.map(teams, function(team) {
              return {
                seats: 100,
                stadium: stadium.id,
                team: team.id
              };
            });

            Associations.Venue.createEach(linkRecords, done);

          });
        });
      });


      it('should return the correct teams', function(done) {
        Associations.Stadium.find({ name: 'hasManyThrough nested stadium' })
        .populate('teams', { 
          where: { 
            or: [
              { 
                and: [
                  { name: 'low' },
                  { or: 
                    [
                      { wins: { '>=': 2 } },
                      { mascot: 'even' }
                    ]
                  }
                ]
              }, 
              { 
                and: [
                  { name: 'high' },
                  {
                    or: [
                      { mascot: { startsWith: 'o' } },
                      { wins: 6 }
                    ]
                  }
                ]
              }
            ]
          },
          sort: 'wins desc'
        })
        .sort([{name: 'desc'}])
        .exec(function(err, stadiums) {
          if (err) {
            return done(err);
          }
          var stadium = stadiums[0];
          assert(stadium);
          assert(_.isArray(stadium.teams));
          assert.equal(stadium.teams.length, 6);

          // Expected results:
          // { wins: 2, mascot: 'even', name: 'low' },
          // { wins: 3, mascot: 'odd', name: 'low' },
          // { wins: 4, mascot: 'even', name: 'low' },
          // { wins: 5, mascot: 'odd', name: 'high' },
          // { wins: 6, mascot: 'even', name: 'high' },
          // { wins: 7, mascot: 'odd', name: 'high' },
          assert.equal(stadium.teams[0].wins, 7);
          assert.equal(stadium.teams[1].wins, 6);
          assert.equal(stadium.teams[2].wins, 5);
          assert.equal(stadium.teams[3].wins, 4);
          assert.equal(stadium.teams[4].wins, 3);
          assert.equal(stadium.teams[5].wins, 2);


          return done();
        });
      });

    });
  });
});
