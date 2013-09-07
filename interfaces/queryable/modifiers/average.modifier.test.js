var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
    assert = require('assert');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

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

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

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
