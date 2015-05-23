var assert = require('assert');
var _ = require('lodash');

describe('autoIncrement attribute feature', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Waterline = require('waterline');
  var defaults = { migrate: 'alter' };
  var waterline;

  var AutoIncFixture = require('./support/autoInc.fixture.js')
  var AutoIncModel;


  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(AutoIncFixture);
    done();
  });

  beforeEach(function(done) {
    var connections = { autoIncConn: _.clone(Connections.test) };

    Adapter.teardown('autoIncConn', function adapterTeardown(){
      waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, ontology) {
        if(err) return done(err);
        AutoIncModel = ontology.collections['autoinc'];
        done();
      });
    });
  });

  afterEach(function(done) {
    if(!Adapter.hasOwnProperty('drop')) return done();
    
    AutoIncModel.drop(function(err) {
      if(err) return done(err);
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });


  /////////////////////////////////////////////////////
  // TEST METHODS
  ////////////////////////////////////////////////////

  var testName = '.create() test autoInc unique values';
  var lastIds;
  var lastValues;


  it('should auto generate unique values', function(done) {
    var records = [];
    for(var i=0; i<10; i++) {
      records.push({ name: 'ai_' + i, type: testName });
    }

    AutoIncModel.create(records, function(err) {
      if (err) return done(err);

      AutoIncModel.find({where : { type: testName }, sort : {name : 1}}, function(err, records) {
        if (err) return done(err);
        assert(!err);
        assert.equal(records.length, 10, 'Expecting 10 records, but got '+records.length);

        assert(records[0].id);
        assert.equal(records[0].name, 'ai_0');
        assert(records[0].aiField);
        assert(records[0].normalField === null || records[0].normalField === undefined);

        var ids = lastIds = _.pluck(records, 'id');
        assert.equal(ids.length, 10);
        assert.equal(_.unique(ids).length, 10, 'Generated ids are not unique: '+ids.join(', '));

        var aiValues = lastValues = _.pluck(records, 'aiField');
        assert.equal(aiValues.length, 10);
        assert.equal(_.unique(aiValues).length, 10, 'Generated values are not unique: '+aiValues.join(', '));

        done();
      });

    });
  });


  it('should auto generate unique values even when values have been set', function(done) {
    // Create some initial records with auto inc values already set. Type matches are ensured by using the
    // values generated in the previous test, also ensuring that if there is a fixed sequence of values being
    // used the first values are already taken.
    var records = [];
    for(var i=0; i<5; i++) {
      records.push({ id: lastIds[i], name: 'ai_' + i, aiField: lastValues[i], normalField: 10, type: testName });
    }

    AutoIncModel.create(records, function(err) {
      if (err) return done(err);

      AutoIncModel.find({where : { type: testName }, sort : {name : 1}}, function(err, records) {
        if (err) return done(err);
        assert(!err);
        assert.equal(records.length, 5, 'Expecting 5 records, but got '+records.length);

        assert.equal(records[0].id, lastIds[0]);
        assert.equal(records[0].name, 'ai_0');
        assert.equal(records[0].aiField, lastValues[0]);
        assert.equal(records[0].normalField, 10);

        var ids = _.pluck(records, 'id');
        assert.deepEqual(ids, lastIds.slice(0,5));

        var aiValues = _.pluck(records, 'aiField');
        assert.deepEqual(aiValues, lastValues.slice(0,5));


        // Create another set of records without auto inc values set. The generated values should be
        // unique, even when compared to those set explicitly.
        var records = [];
        for(var i=5; i<10; i++) {
          records.push({ name: 'ai_' + i, type: testName });
        }

        AutoIncModel.create(records, function(err) {
          if (err) return done(err);

          AutoIncModel.find({where : { type: testName }, sort : {name : 1}}, function(err, records) {
            if (err) return done(err);
            assert(!err);
            assert.equal(records.length, 10, 'Expecting 10 records, but got '+records.length);

            assert.equal(records[0].id, lastIds[0]);
            assert.equal(records[0].name, 'ai_0');
            assert.equal(records[0].aiField, lastValues[0]);

            assert(records[5].id);
            assert.equal(records[5].name, 'ai_5');
            assert(records[5].aiField);

            var ids = _.pluck(records, 'id');
            assert.equal(ids.length, 10);
            assert.equal(_.unique(ids).length, 10, 'Preset and generated ids are not unique: '+ids.join(', '));

            var aiValues = _.pluck(records, 'aiField');
            assert.equal(aiValues.length, 10);
            assert.equal(_.unique(aiValues).length, 10, 'Preset and generated values are not unique: '+aiValues.join(', '));

            done();
          });
        });

      });
    });

  });
});
