var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Queryable Interface', function() {
  describe('SORT Query Modifier', function() {
    before(function(done) {

      // Insert 10 Users
      var users = [];
      var date;

      for(var i=0; i<10; i++) {
        users.push({
          first_name: 'sort_user' + i,
          type: 'sort test',
          age: i+1
        });
      }

      Queryable.User.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should sort records using asc', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'sort test' 
        }, 
        sort: [{ 
          age: 'asc' 
        }]
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 10);
        assert.equal(users[0].first_name, 'sort_user0');
        
        return done();
      });
    });

    it('should sort records using desc', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'sort test' 
        }, 
        sort: [{ 
          age: 'desc' 
        }]
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 10);
        assert.equal(users[0].first_name, 'sort_user9');
        
        return done();
      });
    });


    it('should sort when sort is an option', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'sort test' 
        } 
      }, 
      { 
        sort: [{ 
          age: 'desc' 
        }]
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        assert.strictEqual(users.length, 10);
        assert.equal(users[0].first_name, 'sort_user9');
        
        return done();
      });
    });
  });


  describe('Multiple SORT criteria searches', function() {
    before(function(done) {
      // Insert 3 Users
      var users = [
        { first_name: 'foo', last_name: 'smith', type: 'sort test multi' },
        { first_name: 'joe', last_name: 'smith', type: 'sort test multi' },
        { first_name: 'bob', last_name: 'foo', type: 'sort test multi' }
      ];

      Queryable.User.createEach(users, function(err, users) {
        if (err) {
          return done(err);
        }

        return done();
      });
    });

    it('should sort records using multiple sort criteria, with first name desc', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'sort test multi' 
        }, 
        sort: [
          { 
            last_name: 'asc'
          },
          { 
            first_name: 'desc'
          } 
        ]
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        // check the smith's are together and ordered by first_name
        assert.equal(users[0].first_name, 'bob');
        assert.equal(users[1].last_name, 'smith');
        assert.equal(users[2].last_name, 'smith');

        assert.equal(users[1].first_name, 'joe');
        assert.equal(users[2].first_name, 'foo');
        
        return done();
      });
    });

    it('should sort records using multiple sort criteria, with first name asc', function(done) {
      Queryable.User.find({ 
        where: { 
          type: 'sort test multi' 
        }, 
        sort: [
          { 
            last_name: 'asc'
          }, 
          {
            first_name: 'asc'
          }
        ]
      })
      .exec(function(err, users) {
        if (err) {
          return done(err);
        }

        // check the smith's are together and ordered by first_name
        assert.equal(users[0].first_name, 'bob');
        assert.equal(users[1].last_name, 'smith');
        assert.equal(users[2].last_name, 'smith');

        assert.equal(users[1].first_name, 'foo');
        assert.equal(users[2].first_name, 'joe');
        
        return done();
      });
    });
  });
});
