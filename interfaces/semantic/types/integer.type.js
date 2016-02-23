var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Integer Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper integer', function(done) {
        Semantic.User.create({ age: 27 }, function (err, createdRecord) {
          assert.ifError(err);
          assert.strictEqual(createdRecord.age, 27);
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            assert.ifError(err);
            assert.strictEqual(record.age, 27);
            done();
          });
        });
      });

    });
  });
});
