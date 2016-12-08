var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe('String Type', function() {
    describe('with valid data', function() {
      it('should store proper string value', function(done) {
        Semantic.User.create({ first_name: 'Foo' }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(createdRecord.first_name, 'Foo');
          
          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.equal(record.first_name, 'Foo');
            
            return done();
          });
        });
      });
    });
  });
});
