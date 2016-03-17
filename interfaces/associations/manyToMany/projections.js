var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {
  describe('Many to Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driver;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany findOne' }, function(err, _driver) {
        if(err) {
          return done(err);
        }

        driver = _driver;

        _driver.taxis.add({ model: 'sedan', medallion: 101 });
        _driver.save(function(err) {
          if(err) {
            return done(err);
          }
          done();
        });
      });
    });

    describe('projections', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should filter populated attributes when projections are used', function(done) {
        Associations.Driver.findOne({ id: driver.id })
        .populate('taxis', { select: ['model'] })
        .exec(function(err, driver) {
          assert.ifError(err);
          assert(driver);
          assert(_.isArray(driver.taxis));
          assert.equal(driver.taxis.length, 1);

          // JSON stringify the record to remove any virtual functions such
          // as associations with .add/.remove
          var record = driver.toJSON();

          assert.equal(_.keys(record.taxis[0]).length, 2);
          assert(record.taxis[0].id);
          assert.equal(record.taxis[0].model, 'sedan');
          done();
        });
      });

    });
  });
});
