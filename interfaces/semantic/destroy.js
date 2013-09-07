var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User;

  before(function(done) {
    var waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      User = colls.user;
      done();
    });
  });

  describe('.destroy()', function() {

    describe('a single record', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {
        User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy a record', function(done) {
        User.destroy({ first_name: 'Destroy' }, function(err, status) {
          assert(!err);
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        User.find({ first_name: 'Destroy' }, function(err, users) {
          assert(users.length === 0);
          done();
        });
      });

    });

    describe('with numeric ID', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var user;

      // Create a user to test destroy on
      before(function(done) {
        User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err, record) {
          if(err) return done(err);
          user = record;
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy a record', function(done) {
        User.destroy(user.id, function(err, status) {
          assert(!err);
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        User.find({ first_name: 'Destroy' }, function(err, users) {
          assert(users.length === 0);
          done();
        });
      });
    });

    describe('multiple records', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      beforeEach(function(done) {
        User.createEach([
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' }
        ], done);
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should destroy all the records', function(done) {
        User.destroy(function(err, users) {
          assert(!err);
          done();
        });
      });

      it('should return an empty array when searched for', function(done) {
        User.find({ first_name: 'Destroy' }, function(err, users) {
          assert(users.length === 0);
          done();
        });
      });

    });
  });
});
