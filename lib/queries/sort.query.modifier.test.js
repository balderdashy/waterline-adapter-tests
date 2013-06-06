var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('SORT Query Modifier', function() {

    before(function(done) {

      // Insert 10 Users
      var users = [],
          date;

      for(var i=0; i<10; i++) {
        date = new Date();
        date.setMinutes(date.getMinutes() + i);

        users.push({
          first_name: 'sort_user' + i,
          type: 'sort test',
          dob: date
        });
      }

      User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    it('should sort records using binary notation for asc', function(done) {
      User.find({ where: { type: 'sort test' }, sort: { dob: 1 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user0');
        done();
      });
    });

    it('should sort records using binary notation desc', function(done) {
      User.find({ where: { type: 'sort test' }, sort: { dob: 0 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

    it('should sort records using string notation for asc', function(done) {
      User.find({ where: { type: 'sort test' }, sort: 'dob asc' }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user0');
        done();
      });
    });

    it('should sort records using string notation for desc', function(done) {
      User.find({ where: { type: 'sort test' }, sort: 'dob desc' }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

    it('should sort when sort is an option', function(done) {
      User.find({ where: { type: 'sort test' } }, { sort: { dob: 0 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

  });
});
