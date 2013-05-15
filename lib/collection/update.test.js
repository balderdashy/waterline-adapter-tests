var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Collection', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('.update()', function() {

    describe('attributes', function() {

      // Create a user to test updates on
      before(function(done) {
        User.create({ first_name: 'Update', last_name: 'Test' }, function(err) {
          if(err) return done(err);
          done();
        });
      });

      it('should update model attributes', function(done) {
        User.update({ first_name: 'Update' }, { first_name: 'Updated' }, function(err, user) {
          assert(!err);
          assert(user.first_name === 'Updated');
          done();
        });
      });

      it('should return a model instance', function(done) {
        User.update({ first_name: 'Updated' }, { first_name: 'Updated Again' }, function(err, user) {
          assert(!err);
          assert(user.fullName() === 'Updated Again Test');
          done();
        });
      });
    });

    describe('find updated record', function() {

      // Create a user to test updates on
      before(function(done) {
        User.create({ first_name: 'Update Find', last_name: 'Test' }, function(err) {
          if(err) return done(err);

          User.update({ first_name: 'Update Find' }, { first_name: 'Updated Find' }, function(err) {
            if(err) return done(err);
            done();
          });
        });
      });

      it('should allow the record to be found', function(done) {
        User.find({ first_name: 'Updated Find' }, function(err, user) {
          assert(!err);
          assert(user.first_name === 'Updated Find');
          done();
        });
      });

      it('should only result in a single Model existing', function(done) {
        User.findAll({ first_name: 'Updated Find' }, function(err, users) {
          assert(!err);
          assert(users.length === 1);
          done();
        });
      });
    });

  });
});
