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

  describe('AVERAGE Query Modifier', function() {

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

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    it('should average by key and only return that key with the average value', function(done) {
      User.find({ where:{type: 'average test'}, average: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 4.5);
        done();
      });
    });

    it('should average by multiple keys and return averages per key', function(done) {
      User.find({ where:{type: 'average test'}, average: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 4.5);
        assert(summed[0].percent === 2.25);
        done();
      });
    });

  });


});
