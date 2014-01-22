var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.semantic = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('.create()', function() {

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should create a new record', function(done) {
      User.create({ first_name: 'Foo' }, function(err, record) {
        if (err) { console.error(err); }
        assert(!err);
        assert(record.first_name === 'Foo');
        done();
      });
    });

    it('should return a generated PK', function(done) {
      User.create({ first_name: 'FooBar' }, function(err, user) {
        if (err) { console.error(err); }
        assert(!err);
        assert(user.first_name === 'FooBar');
        assert(user.id);
        done();
      });
    });

    it('should return generated timestamps', function(done) {
      User.create({ first_name: 'Foo', last_name: 'Bar' }, function(err, user) {
        if (err) { console.error(err); }
        assert(!err);
        assert(toString.call(user.createdAt) == '[object Date]');
        assert(toString.call(user.updatedAt) == '[object Date]');
        done();
      });
    });

    it('should return a model instance', function(done) {
      User.create({ first_name: 'Foo', last_name: 'Bar' }, function(err, user) {
        if (err) { console.error(err); }
        assert(!err);
        assert(user.fullName() === 'Foo Bar');
        done();
      });
    });

    it('should normalize undefined values to null', function(done) {
      User.create({ first_name: 'Yezy', last_name: undefined }, function(err, user) {
        assert(!err);
        assert(user.last_name === null);
        done();
      });
    });

    describe('overloaded usage of create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var testName = '.create() test create a list';

      before(function(done) {
        var users = [];

        for(var i=0; i<4; i++) {
          users.push({ first_name: 'test_' + i, type: testName });
        }

        User.create(users, done);
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should have saved the proper values (with auto-increment values)', function(done) {
        User.find({ type: testName }, function(err, users) {
          if (err) { console.error(err); }
          assert(!err);
          assert(users.length === 4);
          assert(users[0].first_name === 'test_0' );
          done();
        });
      });
    });

  });
});
