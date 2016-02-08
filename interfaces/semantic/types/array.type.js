var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Array Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////
      
      function assertArrayMatches(actual, expected){
        assert(Array.isArray(actual));
        assert.strictEqual(actual.length, expected.length);
        assert.deepEqual(actual, expected);
      }
      
      var id;

      it('should store proper array value', function(done) {
        var original = [0,1,2,3];
        Semantic.User.create({ list: original }, function(err, createdRecord) {
          id = createdRecord.id;
          assert(!err);
          assertArrayMatches(createdRecord.list, original);
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert(!err);
            assertArrayMatches(record.list, original);
            done();
          });
        });
      });
      
      it('should update proper array value', function(done) {
        var original = [0,1,2];
        Semantic.User.update(id, { list: original }, function(err, updatedRecords) {
          var updatedRecord = updatedRecords[0];
          assert(!err);
          assertArrayMatches(updatedRecord.list, original);
          assertArrayMatches(updatedRecord.afterUpdateValues.list, original);
          Semantic.User.findOne({id: updatedRecord.id}, function (err, record) {
            assert(!err);
            assertArrayMatches(record.list, original);
            done();
          });
        });
      });
    });
  });
});
