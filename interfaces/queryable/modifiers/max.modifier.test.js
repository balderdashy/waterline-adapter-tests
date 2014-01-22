var Waterline = require('waterline'),
    Model = require('../support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.queryable = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('MAX Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'max_user' + i,
          type: 'max test',
          age: i + 9001,
          percent: i/2 + 9001
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

    it('should get the maximum of the key', function(done) {
      User.find({where:{type: 'max test'}, max: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 9010);
        done();
      });
    });

    it('should max multiple keys', function(done) {
      User.find({where:{type: 'max test'}, max: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 9010);
        assert(summed[0].percent === 9005.5);
        done();
      });
    });

    it('should max and average', function(done) {
      User.find({
        where:{type: 'max test'},
        max: ['age'],
        average: ['percent']
      }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === 9010);
        assert(summed[0].percent === 9003.25);
        done();
      });
    });

  });
});
