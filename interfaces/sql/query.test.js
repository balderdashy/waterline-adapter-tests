var assert = require('assert'),
    _ = require('lodash');

describe('SQL Interface', function() {

  describe('.query()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      // Insert 1 User
      Sql.User.create({first_name: 'query_user', type: 'query test', age: 10 }, function(err, user) {
        if(err) return done(err);
        done();
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////
    
    it('should have method .query()', function(done) {
      assert(Sql.User.query);
      assert(_.isFunction(Sql.User.query));
      done();
    });

    it('should return non undefined result', function(done) {
      Sql.User.query('SELECT * FROM usertablesql', undefined, function(err, users) {
        assert.ifError(err);
        assert(users);
        done();
      });
    });

  });
});
