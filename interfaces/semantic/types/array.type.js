var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Array Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper array value', function(done) {
        Semantic.User.create({ list: [0,1,2,3] }, function(err, createdRecord) {
          assert(!err);
          assert(Array.isArray(createdRecord.list));
          assert(createdRecord.list.length === 4);
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert(!err);
            assert(Array.isArray(record.list));
            assert(record.list.length === 4);
            done();
          });
        });
      });
    });
  });
});
