var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('JSON Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper object value', function(done) {
        Semantic.User.create({ obj: {foo: 'bar'} }, function(err, record) {
          assert(!err);
          assert(record.obj === Object(record.obj));
          assert(record.obj.foo === 'bar');
          done();
        });
      });

    });
  });
});
