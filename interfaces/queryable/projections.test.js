var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {

  describe('select()', function() {
    var User;

    before(function(done) {
      Queryable.Userforqueryableinterface.destroy({}, function(err) {
        if (err) {
          return done(err);
        }

        var user = {
          first_name: 'foo',
          last_name: 'bar',
          type: 'bot'
        };

        Queryable.Userforqueryableinterface.create(user, function(err, users) {
          if (err) {
            return done(err);
          }

          User = users[0];

          return done();
        });
      });
    });

    // In order for the integrator to work correctly records must have a primary
    // key. This is enforced at the query builder level.
    it('should limit the fields returned but always enforce the primary key', function(done) {
      Queryable.Userforqueryableinterface.find()
      .select(['first_name', 'last_name'])
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 3);
        assert(users[0].id);
        assert.equal(users[0].first_name, 'foo');
        assert.equal(users[0].last_name, 'bar');

        return done();
      });
    });

    it('should work with the callback style', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, select: ['first_name', 'last_name']}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 3);
        assert(users[0].id);
        assert.equal(users[0].first_name, 'foo');
        assert.equal(users[0].last_name, 'bar');

        return done();
      });
    });

    it('should return all the fields when a star is used', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, select: ['*']}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 8);
        assert(users[0].id);
        assert(users[0].first_name);
        assert(users[0].last_name);
        assert(users[0].type);
        assert(users[0].updatedAt);
        assert(users[0].createdAt);

        return done();
      });
    });

    it('should normalize select star into an array', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, select: '*'}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 8);
        assert(users[0].id);
        assert(users[0].first_name);
        assert(users[0].last_name);
        assert(users[0].type);
        assert(users[0].updatedAt);
        assert(users[0].createdAt);

        return done();
      });
    });

    it('should error when an ambiguous select is used', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, select: ['*', 'first_name']}, function(err, users) {
        assert(err);
        return done();
      });
    });

    it('should return the primary key when an empty select is used', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, select: []}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 1);
        assert(users[0].id);

        return done();
      });
    });
  });

  describe('omit()', function() {
    var User;

    before(function(done) {
      Queryable.Userforqueryableinterface.destroy({}, function(err) {
        if (err) {
          return done(err);
        }

        var user = {
          first_name: 'foo',
          last_name: 'bar',
          type: 'bot'
        };

        Queryable.Userforqueryableinterface.create(user, function(err, users) {
          if (err) {
            return done(err);
          }

          User = users[0];

          return done();
        });
      });
    });

    // In order for the integrator to work correctly records must have a primary
    // key. This is enforced at the query builder level.
    it('should limit the fields returned but always enforce the primary key', function(done) {
      Queryable.Userforqueryableinterface.find()
      .omit(['first_name', 'last_name', 'age', 'email', 'updatedAt', 'createdAt'])
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }
        console.log(_.keys(users[0]))
        assert.equal(_.keys(users[0]).length, 2);
        assert(users[0].id);
        assert.equal(users[0].type, 'bot');

        return done();
      });
    });

    it('should work with the callback style', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, omit: ['first_name', 'last_name', 'age', 'email', 'updatedAt', 'createdAt']}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert.equal(_.keys(users[0]).length, 2);
        assert(users[0].id);
        assert.equal(users[0].type, 'bot');

        return done();
      });
    });

    it('should error when an attempt is made to omit the primary key', function(done) {
      Queryable.Userforqueryableinterface.find({ where: {}, omit: ['id']}, function(err, users) {
        assert(err);
        return done();
      });
    });

  });

});
