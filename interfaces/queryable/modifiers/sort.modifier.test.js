var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('SORT Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

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

      Queryable.User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should sort records using binary notation for asc', function(done) {
      Queryable.User.find({ where: { type: 'sort test' }, sort: { dob: 1 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user0');
        done();
      });
    });

    it('should sort records using binary notation desc', function(done) {
      Queryable.User.find({ where: { type: 'sort test' }, sort: { dob: 0 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

    it('should sort records using string notation for asc', function(done) {
      Queryable.User.find({ where: { type: 'sort test' }, sort: 'dob asc' }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user0');
        done();
      });
    });

    it('should sort records using string notation for desc', function(done) {
      Queryable.User.find({ where: { type: 'sort test' }, sort: 'dob desc' }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

    it('should sort when sort is an option', function(done) {
      Queryable.User.find({ where: { type: 'sort test' } }, { sort: { dob: 0 } }, function(err, users) {
        assert(!err);
        assert(users.length === 10);
        assert(users[0].first_name === 'sort_user9');
        done();
      });
    });

  });


  describe('Multiple SORT criteria searches', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 3 Users
      var users = [

        { first_name: 'foo', last_name: 'smith', type: 'sort test multi' },
        { first_name: 'joe', last_name: 'smith', type: 'sort test multi' },
        { first_name: 'bob', last_name: 'foo', type: 'sort test multi' }

      ];

      Queryable.User.createEach(users, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should sort records using multiple sort criteria, with first name desc', function(done) {
      Queryable.User.find({ where: { type: 'sort test multi' }, sort: { last_name: 1, first_name: 0 } }, function(err, users) {
        assert(!err);

        // check the smith's are together and ordered by first_name
        assert(users[0].first_name === 'bob');
        assert(users[1].last_name === 'smith');
        assert(users[2].last_name === 'smith');

        assert(users[1].first_name === 'joe');
        assert(users[2].first_name === 'foo');
        done();
      });
    });

    it('should sort records using multiple sort criteria, with first name asc', function(done) {
      Queryable.User.find({ where: { type: 'sort test multi' }, sort: { last_name: 1, first_name: 1 } }, function(err, users) {
        assert(!err);

        // check the smith's are together and ordered by first_name
        assert(users[0].first_name === 'bob');
        assert(users[1].last_name === 'smith');
        assert(users[2].last_name === 'smith');

        assert(users[1].first_name === 'foo');
        assert(users[2].first_name === 'joe');
        done();
      });
    });

  });
});
