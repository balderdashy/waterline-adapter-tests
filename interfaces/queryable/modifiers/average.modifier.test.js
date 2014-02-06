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
      Queryable.User.find({ where:{type: 'average test'}, average: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 4.5);
        done();
      });
    });

    it('should average by multiple keys and return averages per key', function(done) {
      Queryable.User.find({ where:{type: 'average test'}, average: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 4.5);
        assert(summed[0].percent === 2.25);
        done();
      });
    });

  });
});
