var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Integer Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper integer', function(done) {
        Semantic.User.create({ age: 27 }, function(err, record) {
          assert(!err);
          assert(record.age === 27);
          done();
        });
      });

    });
  });
});
