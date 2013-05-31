var Model = require('../fixtures/crud'),
    assert = require('assert');

describe('Query', function() {
  var User;

  before(function(done) {
    User = new Model({ adapters: { test: Adapter }}, function(err) {
      if(err) return done(err);
      done();
    });
  });

  describe('LIKE Query Modifier', function() {

    /**
     * Handle Basic LIKE modifier
     */

    describe('basic query usage', function() {

      it('should return the user with the given name', function(done) {
        var part = 'basic LIKE query test',
            testName = '24g basic LIKE query test asdcxbzbasg';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.findOne({ like: { first_name: part } }, function(err, user) {
            assert(!err);
            assert(user.first_name === testName);
            done();
          });
        });
      });

      it('should support wrapping both sides with a % sign', function(done) {
        var part = 'basic LIKE query test with sign',
            testName = '24gdddaga4 basic LIKE query test with sign asdcxbzbasg';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.findOne({ like: { first_name: '%'+part+'%' } }, function(err, user) {
            assert(!err);
            assert(user.first_name === testName);
            done();
          });
        });
      });
    });

    /**
     * Handle Special LIKE modifiers:
     * startsWith, endsWith, contains, etc
     */

    describe('special LIKE modifiers', function() {

      it('should support startsWith()', function(done) {
        var part = 'xxj8xrxh!!!r',
            testName = 'xxj8xrxh!!!r basic startsWith query test';

        User.create({ first_name: testName }, function(err) {
          if (err) return done(err);

          User.startsWith({ first_name: part }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === testName);
            done();
          });
        });
      });

      it('should support contains() (same as LIKE if query doesn\'t contain % signs)', function(done) {
        var part = 'xx3ah4aj8xrxh!!!r',
            testName = 'xx3ah4aj8xrxh!!!r  basic contains query test';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.contains({ first_name: part }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === testName);
            done();
          });
        });
      });

      it('should support endsWith()', function(done) {
        var part = 'xxj8xa4hPFDH',
            testName = 'basic endsWith query test xxj8xa4hPFDH';

        User.create({ first_name: testName }, function(err) {
          if(err) return done(err);

          User.endsWith({ first_name: part }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].first_name === testName);
            done();
          });
        });
      });

    });

    describe('dynamic LIKE modifiers', function() {

      it('should have [attribute]StartsWith() method', function(done) {
        var part = 'xxj8xrxh!!!r',
            testType = part + 'test';

        User.create({ type: testType }, function(err) {
          if(err) return done(err);

          User.typeStartsWith(part, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].type === testType);
            done();
          });
        });
      });

      it('should have [attribute]EndsWith() method', function(done) {
        var part = 'xxj8xrxh!!!r',
            testType = 'test' + part;

        User.create({ type: testType }, function(err) {
          if(err) return done(err);

          User.typeEndsWith(part, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].type === testType);
            done();
          });
        });
      });

      it('should have [attribute]contains() method', function(done) {
        var part = 'xxx',
            testType = 'test' + part + 'test';

        User.create({ type: testType }, function(err) {
          if(err) return done(err);

          User.typeContains(part, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 1);
            assert(users[0].type === testType);
            done();
          });
        });
      });

    });

    describe('.findByLike()', function() {

      it('should return the user with the given name', function(done) {
        var part = 'findLike',
            testName = 'asdgah4 test_findLike asg';

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

    describe('.findAllLike()', function() {

      it('should return the users with the given name', function(done) {
        var part = 'findAllLike',
            testName = 'zz 340ajsdha test_findAllLike -- aw40gasdha',
            testName2 = 'zz zzbjfk test_findAllLike2../haer-h';

        User.createEach([{ first_name: testName }, { first_name: testName2 }], function(err) {
          if (err) return done(err);

          User.findLike({ first_name: part }, function(err, users) {
            assert(!err);
            assert(Array.isArray(users));
            assert(users.length === 2);
            assert(users[0].first_name === testName);
            assert(users[1].first_name === testName2);
            done();
          });
        });
      });
    });

  });
});
