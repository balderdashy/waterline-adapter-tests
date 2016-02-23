var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {
  
  describe('n:m association :: .update()', function() {

    describe('update parent association()', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var Driver;

      before(function(done) {
        
        Associations.Driver.create({ name: 'm:m update', taxis: [ { medallion: 1 } ] }).exec(function(err, driver) {
          if(err) return done(err);
          Driver = driver;
          done();
        });

      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should update model attributes without modifying nested association', function(done) {
        Associations.Driver.update({ name: 'm:m update' }, { name: 'm:m updated' }, function(err, drivers) {
          assert.ifError(err);
          assert(Array.isArray(drivers));
          assert.equal(drivers.length, 1);
          assert.equal(drivers[0].name, 'm:m updated');
          
          Associations.Driver.findOne({ name: 'm:m updated' })
          .populate('taxis')
          .then(function(driver){
            assert(Array.isArray(driver.taxis));
            assert.equal(driver.taxis[0].medallion, 1);
            done();
          })
          .catch(done);
          
        });
      });
    });


    describe('update parent association() using save()', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var Driver;

      before(function(done) {
        
        Associations.Driver.create({ name: 'm:m update add', taxis: [ { medallion: 2 } ] }).exec(function(err, driver) {
          if(err) return done(err);
          Driver = driver;
          done();
        });

      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should update model attributes after find.populate using save()', function(done) {
        Associations.Driver.findOne({ name: 'm:m update add' })
        .populate('taxis')
        .then(function(driver){
          
          driver.name = 'm:m updated add';
          driver.save(function(err){
            assert.ifError(err);
            
            Associations.Driver.findOne({ name: 'm:m updated add' })
            .populate('taxis')
            .then(function(driver){
              assert(driver);
              assert(Array.isArray(driver.taxis));
              assert.equal(driver.taxis[0].medallion, 2);
              done();
            })
            .catch(done);
            
          });
        })
        .catch(done);
        
      });
    });

  });
});
