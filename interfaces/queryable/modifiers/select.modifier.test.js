var assert = require('assert'),
    _ = require('lodash');

function assertNotProperty(obj, prop){
  assert(prop in obj === false, 'property [' + prop + '] should not exist, but it exists and has value: ' + obj[prop]);
}

describe('Queryable Interface', function() {

  describe('SELECT Query Modifier', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 1 Users
      var users = [];
      for (var i = 0; i < 10; i++) {
        users.push({
          first_name: 'select_user',
          last_name: 'select_name_' + i,
          email: 'select_email',
          title: 'select_title',
          age: 30 + i,
          type: 'select test'
        });
      }

      Queryable.User.create(users, function(err, model) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return a record with a single field first_name', function(done) {
      Queryable.User.find({ where: { type: 'select test' }, select: ['first_name'], sort: 'age' }, function(err, users) {
        assert.ifError(err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assertNotProperty(user, 'last_name');
        assertNotProperty(user, 'email');
        assertNotProperty(user, 'title');
        assertNotProperty(user, 'age');
        assertNotProperty(user, 'type');
        assertNotProperty(user, 'dob');
        done();
      });
    });
    
    it('should return multiples records with a single field first_name', function(done) {
      Queryable.User.find({ where: {}, select: ['first_name'], sort: 'age' }, function(err, users) {
        assert.ifError(err);
        assert(users.length > 1);
        for(var i=0; i<users.length; i++){
          var user = users[i];
          assert('first_name' in user);
          assertNotProperty(user, 'last_name');
          assertNotProperty(user, 'email');
          assertNotProperty(user, 'title');
          assertNotProperty(user, 'age');
          assertNotProperty(user, 'type');
          assertNotProperty(user, 'dob');
        }
        done();
      });
    });
    
    it('should return a record with a single field first_name (findOne)', function(done) {
      Queryable.User.findOne({ where: { type: 'select test' }, select: ['first_name'] }, function(err, user) {
        assert.ifError(err);
        assert.equal(user.first_name, 'select_user');
        assertNotProperty(user, 'last_name');
        assertNotProperty(user, 'email');
        assertNotProperty(user, 'title');
        assertNotProperty(user, 'age');
        assertNotProperty(user, 'type');
        assertNotProperty(user, 'dob');
        done();
      });
    });

    it('should return a record with multiple fields', function(done) {
      Queryable.User.find({ where: { type: 'select test' }, select: ['first_name', 'age'], sort: 'age' }, function(err, users) {
        assert.ifError(err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assertNotProperty(user, 'last_name');
        assertNotProperty(user, 'email');
        assertNotProperty(user, 'title');
        assert.strictEqual(user.age, 30);
        assertNotProperty(user, 'type');
        assertNotProperty(user, 'dob');
        done();
      });
    });

    it('in absence of SELECT modifier should return a record with all fields', function(done) {
      Queryable.User.find({ where: { type: 'select test' }, sort: 'age' }, function(err, users) {
        assert.ifError(err);
        var user = users[0];
        assert.equal(user.first_name, 'select_user');
        assert.equal(user.last_name, 'select_name_0');
        assert.equal(user.email, 'select_email');
        assert.equal(user.title, 'select_title');
        assert.strictEqual(user.age, 30);
        assert.equal(user.type, 'select test');
        done();
      });
    });

  });
});
