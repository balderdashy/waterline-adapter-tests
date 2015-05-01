var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Float Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper float value', function(done) {
        Semantic.User.create({ percent: 0.001 }, function(err, record) {
          assert(!err);
          assert(record.percent === 0.001);
          done();
        });
      });

    });
  });
});
