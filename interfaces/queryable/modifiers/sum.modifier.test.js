var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('SUM Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'sum_user' + i,
          type: 'sum test',
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

    it('should sum by key and only return that key with the sum value', function(done) {
      Queryable.User.find({ where:{type: 'sum test'}, sum: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 45);
        done();
      });
    });

    it('should sum by multiple keys and return sums of all keys', function(done) {
      Queryable.User.find({ where:{type: 'sum test'}, sum: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 45);
        assert(summed[0].percent === 22.5);
        done();
      });
    });

    it('should sum and average in the same query', function(done) {
      Queryable.User.find({
        where:{type: 'sum test'},
        sum: ['age'],
        average: ['percent']
      }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 45);
        assert(summed[0].percent === 2.25);
        done();
      });
    });

  });
});
