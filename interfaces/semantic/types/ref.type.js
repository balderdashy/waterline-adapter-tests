var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Semantic Interface', function() {
  describe.skip('Ref Type', function() {
    describe('with valid data', function() {
      it('should store proper binary value', function(done) {
        // use a string
        var str = 'test the things';
        // to make a binary thing
        var buf = new Buffer(str, "utf-8");

        // Store the binary thing
        Semantic.User.create({ avatar: buf }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(new Buffer(createdRecord.avatar).toString('utf-8'), str);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }
              
            // read out the stored binary thing
            var outbuf = new Buffer(record.avatar);
            assert.equal(outbuf.toString('utf-8'), str);
            
            return done();
          });
        });
      });
    });
  });
});
