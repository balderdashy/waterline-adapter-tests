var assert = require('assert'),
    _ = require('lodash');

describe('Semantic Interface', function() {

  describe('Binary Type', function() {
    describe('with valid data', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should store proper binary value', function(done) {
        // use a string
        var str = 'test the things';
        // to make a binary thing
        var buf = new Buffer(str, "utf-8");
        // store the binary thing
        Semantic.User.create({ avatar: buf }, function(err, record) {
          assert(!err, err);
          // read out the stored binary thing
          var outbuf = new Buffer(record.avatar);
          
          assert(outbuf.toString('utf-8') === str);
          done();
        });
      });

    });
  });
});