var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.queryable = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('.findOneLike()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return the user with the given name', function(done) {
      var part = 'findOneLike',
          testName = 'asdgah4 test_findOneLike asg';

      User.create({ first_name: testName }, function(err) {
        if (err) return done(err);

        User.findOneLike({ first_name: part }, function(err, user) {
          assert(!err);
          assert(user.first_name === testName);
          done();
        });
      });
    });

  });
});
