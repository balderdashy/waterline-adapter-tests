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

  describe('GroupBy Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'groupBy_user' + i,
          type: 'groupBy test',
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

    it('should group by keys and sum values', function(done) {
      User.find({ groupBy: ['type'], sum: ['age'] }, function(err, grouped) {
        assert(!err);
        var asserted = false;

        asserted = grouped.filter(function(result){
          if(result.type === 'groupBy test') {
            assert(result.age === 45);
            return true;
          }
          return false;
        });

        if(!asserted.length) {
          return done(new Error('key "groupBy test" not found'));
        }

        done();
      });
    });

    it('should group by multiple keys and sum values', function(done) {
      User.find({ groupBy: ['type', 'age'], sum: ['percent'] }, function(err, grouped) {
        assert(!err);
        var asserted = grouped.filter(function(result){
          if(result.type === 'groupBy test' && result.age === 1) {
            assert(result.percent === 0.5);
            return true;
          }
        });

        if(!asserted.length) {
          return done(new Error('key "groupBy test" not found'));
        }

        done();
      });
    });

    it('should group by keys and both sum and average values', function(done) {
      User.find({ groupBy: ['type'], sum: ['age'], average: ['percent'] }, function(err, grouped) {
        assert(!err);
        var asserted = grouped.filter(function(result){
          if(result.type === 'groupBy test') {
            assert(result.age === 45);
            assert(result.percent === 2.25);
            return true;
          }
        });

        if(!asserted.length) {
          return done(new Error('key "groupBy test" not found'));
        }

        done();
      });
    });

    it('should allow match query with groupBy', function(done){
      User.find({where: { age: { '>': 5 } }, groupBy: ['type'], sum: ['age'], average: ['percent'] }, function(err, grouped) {
        assert(!err);
        var asserted = grouped.filter(function(result){
          if(result.type === 'groupBy test') {
            assert(result.age === 30);
            assert(result.percent === 3.75);
            return true;
          }
        });

        if(!asserted.length) {
          return done(new Error('key "groupBy test" not found'));
        }

        done();
      });
    });

    it('should error if not given any calculations to do', function(done) {
      User.find({
        groupBy: ['type']
      }, function(err, summed) {
        assert(err);
        done();
      });
    });

  });
});
