var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('.destroy()', function() {
    describe('a single record', function() {

			var user;

      beforeEach(function(done) {
        Semantic.User.create({ first_name: 'Destroy', last_name: 'Test' }, function(err, record) {
					if (err) {
						return done(err);
					}

					user = record;
					return done();
				});
      });

      it('should destroy a record by first_name', function(done) {
        Semantic.User.destroy({ first_name: user.first_name }, function(err, report) {
          if (err) {
            return done(err);
          }
    
          Semantic.User.find({ first_name: user.first_name }, function(err, users) {
            if (err) {
              return done(err);
            }

            assert.strictEqual(users.length, 0);
            
            return done();
          });
        });
      });

      it('should destroy a record by id', function(done) {
        Semantic.User.destroy({ id: user.id }, function(err, status) {
          if (err) {
            return done(err);
          }

					Semantic.User.find({ id: user.id }, function(err, users) {
						if (err) {
							return done(err);
						}

						assert.strictEqual(users.length, 0);
						
						return done();
					});
        });
      });
    });

    describe('multiple records', function() {
      beforeEach(function(done) {
        Semantic.User.createEach([
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' },
          { first_name: 'dummy_test' }
        ], done);
      });

      it('should destroy all the records', function(done) {
        Semantic.User.destroy({ first_name: 'dummy_test' }, function(err, users) {
          if (err) {
            return done(err);
          }

					Semantic.User.find({ first_name: 'dummy_test' }, function(err, users) {

						if(err) {
							return done(err);
						}
					
						assert.strictEqual(users.length, 0);
          
						return done();
					});
        });
      });

    });
  });
});
