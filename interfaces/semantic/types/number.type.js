var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('Number Type', function() {
    describe('with valid data', function() {
      it('should store proper integer', function(done) {
        Semantic.User.create({ age: 27 }, function (err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(createdRecord.age, 27);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.strictEqual(record.age, 27);
            
            return done();
          });
        });
      });
    });
  });
});
