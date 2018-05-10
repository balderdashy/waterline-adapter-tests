var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {
  describe('n:m association :: .findOne().populate([RECORD], [LIMIT/SORT])', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var driverRecord1;
    var driverRecord2;

    before(function(done) {
      Associations.Driver.create({ name: 'manymany findOne limit1'}, function(err, driver1) {
        if(err) return done(err);

        driver1.taxis.add({ medallion: 1 });
        driver1.taxis.add({ medallion: 2 });

        driver1.save(function(err, savedDriver1) {
          if(err) return done(err);
          
          driverRecord1 = savedDriver1;
          
          Associations.Driver.create({ name: 'manymany findOne limit2'}, function(err, driver2) {
            if(err) return done(err);
        
            driver2.taxis.add(driverRecord1.taxis[0].id);
            driver2.taxis.add(driverRecord1.taxis[1].id);
    
            driver2.save(function(err, savedDriver2) {
              if(err) return done(err);
              
              driverRecord2 = savedDriver2;

              done();
            });
          });
          
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should return correct number of taxis when using limit and multiple drivers share the same taxi.', function(done) {
      Associations.Driver.findOne(driverRecord1.id)
      .populate('taxis', {limit: 2, sort:'medallion ASC'})
      .exec(function(err, driver) {
        assert(!err);
        
        assert(Array.isArray(driver.taxis));
        assert.strictEqual(driver.taxis.length, 2);

        done();
      });
    });

  });
});
