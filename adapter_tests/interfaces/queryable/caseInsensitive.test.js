var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('case sensitivity', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var usersArray = [
        { first_name: 'tHeTest', type: 'case sensitivity' },
        { first_name: 'thetest', type: 'case sensitivity' },
        { first_name: 'THETEST', type: 'case sensitivity' },
        { first_name: 'tHeOtherTest', type: 'case sensitivity' }
      ];

      Queryable.User.createEach(usersArray, function(err, users) {
        if(err) return done(err);
        done();
      });
    });

    describe('.findOne()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should work in a case insensitve fashion by default', function(done) {
        Queryable.User.findOne({ first_name: 'theothertest', type: 'case sensitivity'}, function(err, user) {
          assert(user.id);
          assert(user.first_name === 'tHeOtherTest');
          assert(toString.call(user.createdAt) == '[object Date]');
          assert(toString.call(user.updatedAt) == '[object Date]');
          done();
        });
      });

      it('should work with findOneBy*()', function(done) {
        Queryable.User.findOneByFirst_name('theothertest', function(err, user) {
          assert(user.id);
          assert(user.first_name === 'tHeOtherTest');
          assert(toString.call(user.createdAt) == '[object Date]');
          assert(toString.call(user.updatedAt) == '[object Date]');
          done();
        });
      });

    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should work in a case insensitve fashion by default', function(done) {
        Queryable.User.find({ first_name: 'thetest', type: 'case sensitivity'}, function(err, users) {
          assert(users.length === 3);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

      it('should work with findBy*()', function(done) {
        Queryable.User.findByFirst_name('thetest', function(err, users) {
          assert(users.length === 3);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

    });

    describe('special classified queries', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        var usersArray = [
          { first_name: 'OTHER THINGS 0', type: 'case sensitivity' },
          { first_name: 'OTHER THINGS 1', type: 'case sensitivity' },
          { first_name: 'AR)H$daxx', type: 'case sensitivity' },
          { first_name: 'AR)H$daxxy', type: 'case sensitivity' },
          { first_name: '0n3 m0r3 est', type: 'case sensitivity' }
        ];

        Queryable.User.createEach(usersArray, function(err, users) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('contains should work in a case insensitive fashion by default', function(done) {
        Queryable.User.find({ first_name: { contains: 'hete'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 3);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

      it('startsWith should work in a case insensitive fashion by default', function(done) {
        Queryable.User.find({ first_name: { startsWith: 'the'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 4);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

      it('endsWith should work in a case insensitive fashion by default', function(done) {
        Queryable.User.find({ first_name: { endsWith: 'est'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 5);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

      it('like should work in a case insensitive fashion by default', function(done) {
        Queryable.User.find({ first_name: { like: '%hete%'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 3);
          assert(users[0].id);
          assert(users[0].first_name === 'tHeTest');
          done();
        });
      });

      it('endsWith should actually enforce endswith', function(done) {
        Queryable.User.find({ first_name: { endsWith: 'AR)H$daxx'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 1);
          assert(users[0].id);
          assert(users[0].first_name === 'AR)H$daxx');
          done();
        });
      });

    });

    describe('special characters', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        var usersArray = [
          { first_name: '****Awesome****', type: 'case sensitivity' }
        ];

        Queryable.User.createEach(usersArray, function(err, users) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should escape stars', function(done) {
        Queryable.User.find({ first_name: '****Awesome****', type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 1);
          assert(users[0].id);
          assert(users[0].first_name === '****Awesome****');
          done();
        });
      });

      it('contains should work with stars in the name', function(done) {
        Queryable.User.find({ first_name: { contains: '**Awesome**'}, type: 'case sensitivity' }, function(err, users) {
          assert(users.length === 1);
          assert(users[0].id);
          assert(users[0].first_name === '****Awesome****');
          done();
        });
      });
    });

  });
});
