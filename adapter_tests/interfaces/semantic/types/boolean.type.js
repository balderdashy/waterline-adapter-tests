var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Boolean Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper boolean value', function(done) {
        Semantic.User.create({ status: true }, function(err, record) {
          assert(!err);
          assert(record.status === true);
          done();
        });
      });

    });
  });
});
