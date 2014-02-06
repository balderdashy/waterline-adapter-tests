var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('String Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper string value', function(done) {
        Semantic.User.create({ first_name: 'Foo' }, function(err, record) {
          assert(!err);
          assert(record.first_name === 'Foo');
          done();
        });
      });

    });
  });
});
