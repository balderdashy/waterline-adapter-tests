var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('SQL Interface', function() {
  describe('.find()', function() {
    before(function(done) {

      // Insert 10 Users
      var users = [];

      for(var i=0; i<10; i++) {
        users.push({first_name: 'find_user' + i, type: 'find test', age: i*10 });
      }

      users.push({first_name: 'blackbeard\'s ghost', type: 'find test', age: 999});

      Sql.Userforsqlinterface.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should escape attribute names to prevent SQL injection attacks', function(done) {
      Sql.Userforsqlinterface.find({ type: 'find_test', 'first_name`IS NULL OR 1=1 #': 'whatever' }, function(err, users) {
        assert(err, 'Should have escaped field name and prevented data from being returned (caused an error)');
        assert(!users || !users.length, 'Should have escaped field name and prevented data from being returned');

        return done();
      });
    });

    it('should escape values when using startsWith modifier to prevent SQL injection attacks', function(done) {
      var part = '\\\\\\" OR 1=1; -- %_';
      Sql.Userforsqlinterface.find({ first_name: { startsWith: part }}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(!users.length);

        return done();
      });
    });

    it('should escape values when using endsWith modifier to prevent SQL injection attacks', function(done) {
      var part = '\\\\\\" OR 1=1; -- %_';
      Sql.Userforsqlinterface.find({ first_name: { endsWith: part }}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(!users.length);

        return done();
      });
    });

    it('should escape values when using contains modifier to prevent SQL injection attacks', function(done) {
      var part = '\\\\\\" OR 1=1; -- %_';
      Sql.Userforsqlinterface.find({ first_name: { contains: part }}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(!users.length);

        return done();
      });
    });

    it('should escape values when using like modifier to prevent SQL injection attacks', function(done) {
      var part = '\\\\\\" OR 1=1; -- %_';
      Sql.Userforsqlinterface.find({ first_name: { like: part }}, function(err, users) {
        if (err) {
          return done(err);
        }

        assert(!users.length);

        return done();
      });
    });

    it('should not unneccessarily escape values in criteria', function(done) {
      Sql.Userforsqlinterface.findOne({ first_name: 'blackbeard\'s ghost'}, function(err, user) {
        if (err) {
          return done(err);
        }

        assert(user);
        assert.equal(user.first_name, 'blackbeard\'s ghost');

        return done();
      });
    })
  });
});
