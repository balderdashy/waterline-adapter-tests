var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('JSON Type', function() {
    describe('with valid data', function() {
      it('should store proper object value', function(done) {
        Semantic.User.create({ obj: {foo: 'bar'} }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }
          
          assert.strictEqual(createdRecord.obj, Object(createdRecord.obj));
          assert.equal(createdRecord.obj.foo, 'bar');
          
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.strictEqual(record.obj, Object(record.obj));
            assert.equal(record.obj.foo, 'bar');
            
            return done();
          });
        });
      });
    });
  });
});
