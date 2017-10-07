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

      it('should store proper array value', function(done) {
        Semantic.User.create({ obj: ['foo','bar'] }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(createdRecord.obj));
          assert.equal(createdRecord.obj.length, 2);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert(_.isArray(record.obj));
            assert.equal(record.obj.length, 2);

            return done();
          });
        });
      });

      it('should store proper string value', function(done) {
        Semantic.User.create({ obj: 'holla!' }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(createdRecord.obj, 'holla!');

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.equal(record.obj, 'holla!');

            return done();
          });
        });
      });

      it('should store proper numeric value', function(done) {
        Semantic.User.create({ obj: 123 }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(createdRecord.obj, 123);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.equal(record.obj, 123);

            return done();
          });
        });
      });

      it('should store proper boolean value', function(done) {
        Semantic.User.create({ obj: true }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(createdRecord.obj, true);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.equal(record.obj, true);

            return done();
          });
        });
      });


      it('should store proper null value', function(done) {
        Semantic.User.create({ obj: null }, function(err, createdRecord) {
          if (err) {
            return done(err);
          }

          assert.equal(createdRecord.obj, null);

          Semantic.User.findOne({id: createdRecord.id}, function (err, record) {
            if (err) {
              return done(err);
            }

            assert.equal(record.obj, null);

            return done();
          });
        });
      });

    });
  });

});
