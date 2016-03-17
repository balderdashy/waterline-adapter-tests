var assert = require('assert');
var _ = require('lodash');

describe('Queryable Interface', function() {

  describe('select()', function() {
    var User;

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Start with an known database state to accurately test count
    before(function(done) {
      Queryable.User.destroy(function(err) {
        if(err) return done(err);

        var user = {
          first_name: 'foo',
          last_name: 'bar',
          email: 'foobar@test.com',
          title: 'tester',
          phone: '123-456-7890',
          type: 'bot',
          age: 100,
          dob: new Date(),
          percent: 0.0,
          list: [],
          obj: {}
        }

        Queryable.User.create(user, function(err, users) {
          if(err) return done(err);
          User = users[0];
          done();
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    // In order for the integrator to work correctly records must have a primary
    // key. This is enforced at the query builder level.
    it('should limit the fields returned but always enforce the primary key', function(done) {
      Queryable.User.find()
      .select(['first_name', 'last_name'])
      .exec(function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 3);
        assert(users[0].id);
        assert.equal(users[0].first_name, 'foo');
        assert.equal(users[0].last_name, 'bar');

        done();
      });
    });

    it('should work with the callback style', function(done) {
      Queryable.User.find({ where: {}, select: ['first_name', 'last_name']}, function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 3);
        assert(users[0].id);
        assert.equal(users[0].first_name, 'foo');
        assert.equal(users[0].last_name, 'bar');

        done();
      });
    });

    it('should return all the fields when a star is used', function(done) {
      Queryable.User.find({ where: {}, select: ['*']}, function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 16);
        done();
      });
    });

    it('should normalize select star into an array', function(done) {
      Queryable.User.find({ where: {}, select: '*'}, function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 16);
        done();
      });
    });

    it('should return all fields whenever a star is involved', function(done) {
      Queryable.User.find({ where: {}, select: ['*', 'first_name']}, function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 16);
        done();
      });
    });

    it('should return the primary key when an empty select is used', function(done) {
      Queryable.User.find({ where: {}, select: []}, function(err, users) {
        assert.ifError(err);
        assert.equal(_.keys(users[0]).length, 1);
        assert(users[0].id);
        done();
      });
    });

  });
});
