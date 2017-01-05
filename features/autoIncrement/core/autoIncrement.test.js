var assert = require('assert');
var _ = require('@sailshq/lodash');
var WaterlineUtils = require('waterline-utils');

/**
 * When `autoIncrement` is set to `true` on an attribute and no value is provided for it a
 * new unique value will be assigned by the adapter before the record is created. It is
 * guaranteed that the adapter will assign a unique value not present on any existing record.
 * The values assigned automatically will not necessarily be sequential, which accommodates
 * the use of UUIDs. If a value for the attribute is present in the data provided for a new
 * record it will be saved as-is without any guarantee of uniqueness. The `autoIncrement`
 * option has no effect when updating existing records. The feature flag is `autoIncrement`.
 */
describe('autoIncrement attribute feature', function() {

  describe('migrate: alter', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Waterline = require('waterline');
    var migrate = 'drop';
    var waterline;

    var getAutoIncFixture = require('./../support/autoInc.fixture.js');
    var AutoIncModel;

    beforeEach(function(done) {
      waterline = new Waterline();
      waterline.registerModel(getAutoIncFixture());
      var connections = { autoIncConn: _.clone(Connections.test) };

      Adapter.teardown('autoIncConn', function adapterTeardown(){
        waterline.initialize({ adapters: { wl_tests: Adapter }, datastores: connections, defaults: {} }, function(err, ontology) {
          if(err) return done(err);
          WaterlineUtils.autoMigrations(migrate, ontology, function(err) {
            // Set migrate to `alter` for the next round.
            migrate = 'alter';
            if (err) {
              return done(err);
            }
            AutoIncModel = ontology.collections.autoinc;
            done();
          });
        });
      });
    });

    after(function(done) {
      if(!Adapter.hasOwnProperty('drop')) {
        waterline.teardown(done);
      } else {
        WaterlineUtils.autoMigrations('drop', waterline, function(err1) {
          waterline.teardown(function(err2) {
            return done(err1 || err2);
          });
        });
      }
    });


    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    var testName = '.create() test autoInc unique values';
    var lastIds;


    it('should auto generate unique values', function(done) {
      var records = [];
      for(var i=0; i<10; i++) {
        records.push({ name: 'ai_' + i, type: testName });
      }

      AutoIncModel.createEach(records, function(err) {
        if (err) return done(err);

        AutoIncModel.find({where : { type: testName }, sort : 'name'}, function(err, records) {
          if (err) return done(err);
          assert.ifError(err);
          assert.equal(records.length, 10, 'Expecting 10 records, but got '+records.length);

          assert(records[0].id);
          assert.equal(records[0].name, 'ai_0');
          assert.equal(records[0].normalField, 0);

          var ids = _.pluck(records, 'id');
          lastIds = ids;
          assert.equal(ids.length, 10);
          assert.equal(_.unique(ids).length, 10, 'Generated ids are not unique: '+ids.join(', '));

          done();
        });

      });
    });

    it('should auto generate unique values (second run)', function(done) {
      var records = [];
      for(var i=0; i<10; i++) {
        records.push({ name: 'ai_' + i, type: testName });
      }

      AutoIncModel.createEach(records, function(err) {
        if (err) return done(err);

        AutoIncModel.find({where : { type: testName }, sort : 'name'}, function(err, records) {
          if (err) return done(err);
          assert.ifError(err);
          assert.equal(records.length, 20, 'Expecting 20 records, but got '+records.length);

          assert(records[0].id);
          assert.equal(records[0].name, 'ai_0');
          assert.equal(records[0].normalField, 0);

          var ids = _.pluck(records, 'id');
          lastIds = ids;
          assert.equal(ids.length, 20);
          assert.equal(_.unique(ids).length, 20, 'Generated ids are not unique: '+ids.join(', '));

          done();
        });

      });
    });  

  });


  describe('migrate: safe', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Waterline = require('waterline');
    var migrate = 'drop';
    var waterline;

    var getAutoIncFixture = require('./../support/autoInc.fixture.js');
    var AutoIncModel;

    beforeEach(function(done) {
      waterline = new Waterline();
      waterline.registerModel(getAutoIncFixture());
      var connections = { autoIncConn: _.clone(Connections.test) };
      connections.autoIncConn.dir = '.tmp/autoIncMigrateSafe';

      Adapter.teardown('autoIncConn', function adapterTeardown(){
        waterline.initialize({ adapters: { wl_tests: Adapter }, datastores: connections, defaults: {} }, function(err, ontology) {
          if(err) return done(err);
          WaterlineUtils.autoMigrations(migrate, ontology, function(err) {
            if (err) {
              return done(err);
            }
            // Set migrate to `safe` for the next round
            migrate = 'safe';
            AutoIncModel = ontology.collections.autoinc;
            done();
          });
        });
      });
    });

    after(function(done) {
      if(!Adapter.hasOwnProperty('drop')) {
        waterline.teardown(done);
      } else {
        WaterlineUtils.autoMigrations('drop', waterline, function(err1) {
          waterline.teardown(function(err2) {
            return done(err1 || err2);
          });
        });
      }
    });


    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    var testName = '.create() test autoInc unique values';
    var lastIds;


    it('should auto generate unique values', function(done) {
      var records = [];
      for(var i=0; i<10; i++) {
        records.push({ name: 'ai_' + i, type: testName });
      }

      AutoIncModel.createEach(records, function(err) {
        if (err) return done(err);

        AutoIncModel.find({where : { type: testName }, sort : 'name'}, function(err, records) {
          if (err) return done(err);
          assert.ifError(err);
          assert.equal(records.length, 10, 'Expecting 10 records, but got '+records.length);

          assert(records[0].id);
          assert.equal(records[0].name, 'ai_0');
          assert.equal(records[0].normalField, 0);

          var ids = _.pluck(records, 'id');
          lastIds = ids;
          assert.equal(ids.length, 10);
          assert.equal(_.unique(ids).length, 10, 'Generated ids are not unique: '+ids.join(', '));

          done();
        });

      });
    });

    it('should auto generate unique values (second run)', function(done) {
      var records = [];
      for(var i=0; i<10; i++) {
        records.push({ name: 'ai_' + i, type: testName });
      }

      AutoIncModel.createEach(records, function(err) {
        if (err) return done(err);

        AutoIncModel.find({where : { type: testName }, sort : 'name'}, function(err, records) {
          if (err) return done(err);
          assert.ifError(err);
          assert.equal(records.length, 20, 'Expecting 20 records, but got '+records.length);

          assert(records[0].id);
          assert.equal(records[0].name, 'ai_0');
          assert.equal(records[0].normalField, 0);

          var ids = _.pluck(records, 'id');
          lastIds = ids;
          assert.equal(ids.length, 20);
          assert.equal(_.unique(ids).length, 20, 'Generated ids are not unique: '+ids.join(', '));

          done();
        });

      });
    });  
    
  });

});
