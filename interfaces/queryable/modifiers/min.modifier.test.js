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

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should get the minimum of the key', function(done) {
      User.find({ where:{type: 'min test'}, min: ['age'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === -9);
        done();
      });
    });

    it('should min multiple keys', function(done) {
      User.find({ where:{type: 'min test'}, min: ['age', 'percent'] }, function(err, summed) {
        assert(!err);
        assert(summed[0].age === -9);
        assert(summed[0].percent === -4.5);
        done();
      });
    });

    it('should min and average', function(done) {
      User.find({
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
