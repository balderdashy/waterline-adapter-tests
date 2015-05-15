var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('SELECT Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 1 Users
      var user = {
          first_name: 'select_user',
          last_name: 'select_name',
          email: 'select_email',
          title: 'select_title',
          age: 30,
          type: 'select test'
        };

      Queryable.User.create(user, function(err, model) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return a record with a single field first_name', function(done) {
      Queryable.User.find({ where: { type: 'select test' }, select: ['first_name'] }, function(err, users) {
        assert(!err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, undefined);
        assert.equal(user.email, undefined);
        assert.equal(user.title, undefined);
        assert.equal(user.age, undefined);
        assert.equal(user.type, undefined);
        assert.equal(user.dob, undefined);
        done();
      });
    });
    
    it('should return a record with a single field first_name (findOne)', function(done) {
      Queryable.User.findOne({ where: { type: 'select test' }, select: ['first_name'] }, function(err, user) {
        assert(!err);
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, undefined);
        assert.equal(user.email, undefined);
        assert.equal(user.title, undefined);
        assert.equal(user.age, undefined);
        assert.equal(user.type, undefined);
        assert.equal(user.dob, undefined);
        done();
      });
    });

    it('should return a record with multiple fields', function(done) {
      Queryable.User.find({ where: { type: 'select test' }, select: ['first_name', 'age'] }, function(err, users) {
        assert(!err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, undefined);
        assert.equal(user.email, undefined);
        assert.equal(user.title, undefined);
        assert.strictEqual(user.age, 30);
        assert.equal(user.type, undefined);
        assert.equal(user.dob, undefined);
        done();
      });
    });

    it('in absence of SELECT modifier should return a record with all fields', function(done) {
      Queryable.User.find({ where: { type: 'select test' } }, function(err, users) {
        assert(!err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, 'select_name');
        assert.equal(user.email, 'select_email');
        assert.equal(user.title, 'select_title');
        assert.strictEqual(user.age, 30);
        assert.equal(user.type, 'select test');
        done();
      });
    });

  });
});
