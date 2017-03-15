var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('SELECT Query Modifier', function() {
    before(function(done) {

      // Insert 1 Users
      var users = [];
      for (var i = 0; i < 10; i++) {
        users.push({
          first_name: 'select_user',
          last_name: 'select_name_' + i,
          email: 'select_email',
          age: 30 + i,
          type: 'select test'
        });
      }

      Queryable.Userforqueryableinterface.createEach(users, function(err, model) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should return a record with a single field first_name', function(done) {
      Queryable.Userforqueryableinterface.find({ 
        where: { 
          type: 'select test' 
        }, 
        select: ['first_name'], 
        sort: 'age ASC' 
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert(!_.has(user), 'last_name');
        assert(!_.has(user), 'email');
        assert(!_.has(user), 'age');
        assert(!_.has(user), 'type');
        
        return done();
      });
    });

    it('should return multiples records with a single field first_name', function(done) {
      Queryable.Userforqueryableinterface.find({ 
        where: {}, 
        select: ['first_name'], 
        sort: 'age ASC' 
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert(users.length > 1);
        for(var i=0; i<users.length; i++) {
          var user = users[i];
          assert('first_name' in user);
          assert(!_.has(user), 'last_name');
          assert(!_.has(user), 'email');
          assert(!_.has(user), 'age');
          assert(!_.has(user), 'type');
        }

        return done();
      });
    });

    it('should return a record with a single field first_name (findOne)', function(done) {
      Queryable.Userforqueryableinterface.findOne({ 
        where: { 
          age: 31
        }, 
        select: ['first_name'] 
      })
      .exec(function(err, user) {
        if (err) {
          return done(err);
        }

        assert.equal(user.first_name, 'select_user');
        assert(!_.has(user), 'last_name');
        assert(!_.has(user), 'email');
        assert(!_.has(user), 'age');
        assert(!_.has(user), 'type');
        
        return done();
      });
    });

    it('should return a record with multiple fields', function(done) {
      Queryable.Userforqueryableinterface.find({
        where: { 
          type: 'select test' 
        }, 
        select: ['first_name', 'age'], 
        sort: 'age ASC' 
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert.strictEqual(user.age, 30);
        assert(!_.has(user), 'last_name');
        assert(!_.has(user), 'email');
        assert(!_.has(user), 'type');
        
        return done();
      });
    });

    it('in absence of SELECT modifier should return a record with all fields', function(done) {
      Queryable.Userforqueryableinterface.find({ 
        where: { 
          type: 'select test' 
        }, 
        sort: 'age ASC' 
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        var user = users[0];
        assert.strictEqual(user.age, 30);
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, 'select_name_0');
        assert.equal(user.email, 'select_email');
        assert.equal(user.type, 'select test');
        
        return done();
      });
    });
  });
});
