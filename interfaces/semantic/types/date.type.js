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
        var origDate = Date.parse(date);
        Semantic.User.create({ dob: date }, function(err, createdRecord) {
          assert(!err);
          var createdDate = Date.parse(new Date(createdRecord.dob));
          assert(origDate === createdDate);
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert(!err);
            // Convert both dates to unix timestamps
            var resultDate = Date.parse(new Date(record.dob));
            assert(origDate === resultDate);
            done();
          });
        });
      });

    });
  });
});
