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
        assertNotProperty(user, 'last_name');
        assertNotProperty(user, 'email');
        assertNotProperty(user, 'title');
        assertNotProperty(user, 'age');
        assertNotProperty(user, 'type');
        assertNotProperty(user, 'dob');
        done();
      });
    });
    
    it('should return a record with a single field first_name (findOne)', function(done) {
      Queryable.User.findOne({ where: { type: 'select test' }, select: ['first_name'] }, function(err, user) {
        assert(!err);
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
      Queryable.User.find({ where: { type: 'select test' }, select: ['first_name', 'age'] }, function(err, users) {
        assert(!err);
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
