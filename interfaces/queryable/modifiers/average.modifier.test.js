var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('AVERAGE Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'average_user' + i,
          type: 'average test',
          age: i,
          percent: i/2
        });
      }

      Queryable.User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should average by key and only return that key with the average value', function(done) {
      Queryable.User.find({ where:{type: 'average test'}, average: ['age'] }, function(err, averages) {
        assert(!err,err);
        assert(averages[0].age === 4.5, 'expected averages[0].age to === 4.5, instead averages ==='+require('util').inspect(averages, false, null));
        done();
      });
    });

    it('should average by multiple keys and return averages per key', function(done) {
      Queryable.User.find({ where:{type: 'average test'}, average: ['age', 'percent'] }, function(err, averages) {
        assert(!err,err);
        assert(averages[0].age === 4.5, 'expected averages[0].age to === 4.5, instead averages[0] ==='+require('util').inspect(averages[0], false, null));
        assert(averages[0].percent === 2.25);
        done();
      });
    });

  });
});
