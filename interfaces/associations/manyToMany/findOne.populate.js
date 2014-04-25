var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {
  describe('n:m association :: .findOne().populate()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany findOne'}, function(err, driver) {
        if(err) return done(err);

        driverRecord = driver;

        var taxis = [];
        for(var i=0; i<2; i++) {
          driverRecord.taxis.add({ medallion: i });
        }

        driverRecord.save(function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return taxis when the populate criteria is added', function(done) {
      Associations.Driver.findOne(driverRecord.id)
      .populate('taxis')
      .exec(function(err, driver) {
        assert(!err);

        assert(Array.isArray(driver.taxis));
        assert(driver.taxis.length === 2);

        done();
      });
    });

    it('should not return a taxis object when the populate is not added', function(done) {
      Associations.Driver.findOne(driverRecord.id)
      .exec(function(err, driver) {
        assert(!err);

        var obj = driver.toJSON();
        assert(!obj.taxis);

        done();
      });
    });

    it('should call toJSON on all associated records if available', function(done) {
      Associations.Driver.findOne(driverRecord.id)
      .populate('taxis')
      .exec(function(err, driver) {
        assert(!err);

        var obj = driver.toJSON();
        assert(!obj.name);

        assert(Array.isArray(obj.taxis));
        assert(obj.taxis.length === 2);

        assert(obj.taxis[0].hasOwnProperty('createdAt'));
        assert(!obj.taxis[0].hasOwnProperty('medallion'));
        assert(obj.taxis[1].hasOwnProperty('createdAt'));
        assert(!obj.taxis[1].hasOwnProperty('medallion'));

        done();
      });
    });

  });
});
