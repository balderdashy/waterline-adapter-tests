var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Date Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper date value', function(done) {
        var date = new Date();
        Semantic.User.create({ dob: date }, function(err, record) {
          assert(!err);

          // Convert both dates to unix timestamps
          var origDate = Date.parse(date);
          var resultDate = Date.parse(new Date(record.dob));

          assert.equal(origDate, resultDate);
          done();
        });
      });

    });
  });
});
