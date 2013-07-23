var Model = require('../../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('SUM Query Modifier', function() {

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

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    it('should sum by key and only return that key with the summ value', function(done) {
      User.find({ sum: ['age'] }, function(err, summed) {
        assert(!err);

        // We don't actually know what this should be exactly because we aren't grouping
        assert(summed[0].age > 1 && summed[0].age < 10000000); 
        done();
      });
    });
    
    it('should sum by multiple keys and return sums of all keys', function(done) {
      User.find({ sum: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        
        // We don't actually know what these should be exactly because we aren't grouping
        assert(summed[0].age > 1 && summed[0].age < 10000000);
        assert(summed[0].percent > 10 && summed[0].percent < 300);
        done();
      });
    });
    
    it('should sum and average in the same query', function(done) {
      User.find({
        sum: ['age'],
        average: ['percent']
      }, function(err, summed) {
        assert(!err);
        assert(summed[0].age > 1 && summed[0].age < 10000000);
        assert(summed[0].percent > 0 && summed[0].percent < 101);
        done();
      });
    })

  });


});
