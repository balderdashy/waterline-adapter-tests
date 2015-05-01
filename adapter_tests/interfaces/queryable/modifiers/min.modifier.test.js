var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('MIN Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'min_user' + i,
          type: 'min test',
          age: -i,
          percent: -i/2
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

    it('should get the minimum of the key', function(done) {
      Queryable.User.find({ where:{type: 'min test'}, min: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === -9);
        done();
      });
    });

    it('should min multiple keys', function(done) {
      Queryable.User.find({ where:{type: 'min test'}, min: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === -9);
        assert(summed[0].percent === -4.5);
        done();
      });
    });

    it('should min and average', function(done) {
      Queryable.User.find({
        where:{type: 'min test'},
        min: ['age'],
        average: ['percent']
      }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === -9);
        assert(summed[0].percent === -2.25);
        done();
      });
    });

  });
});
