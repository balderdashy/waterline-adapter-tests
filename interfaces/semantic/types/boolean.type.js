var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('Boolean Type', function() {
    describe('with valid data', function() {
      it('should store proper boolean value', function(done) {
        Semantic.User.create({ status: true }, function (err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.strictEqual(createdRecord.status, true);
          
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.strictEqual(record.status, true);
            
            return done();
          });
        });
      });

    });
  });
});
