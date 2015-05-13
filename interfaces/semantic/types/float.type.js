var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Float Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper float value', function(done) {
        Semantic.User.create({ percent: 0.001 }, function(err, createdRecord) {
          assert(!err);
          assert.equal(createdRecord.percent, 0.001);
          Semantic.User.findOne({id: createdRecord.id}, function(err, record) {
            assert(!err);
            assert.equal(record.percent, 0.001);
            done();
          });
        });
      });

    });
  });
});
