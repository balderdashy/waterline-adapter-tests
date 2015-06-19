var assert = require('assert');
var _ = require('lodash');

/**
 * If the adapter will provide sequential unique values, for example increasing integers,
 * then it is further guaranteed that the next value will be the last saved value plus one
 * increment. If a value is provided and is larger than the current auto-inc counter the
 * counter will be bumped to the provided value. If a provided value is less than or equal
 * to the auto-inc counter value the counter will remain unchanged, and again there will
 * be no guaranteed that this value is unique. This extended feature is indicated with
 * the `autoIncrementSequential` feature flag.
 */
describe('autoIncrement attribute Sequential feature', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Waterline = require('waterline');
  var defaults = { migrate: 'alter' };
  var waterline;

  var AutoIncFixture = require('../support/autoInc.fixture.js');
  var AutoIncModel;


  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(AutoIncFixture);

    var connections = { autoIncConn: _.clone(Connections.test) };

    Adapter.teardown('autoIncConn', function adapterTeardown(){
      waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, ontology) {
        if(err) return done(err);
        AutoIncModel = ontology.collections['autoinc'];
        done();
      });
    });
  });

  after(function(done) {
    if(!Adapter.hasOwnProperty('drop')) {
      waterline.teardown(done);
    } else {
      AutoIncModel.drop(function(err1) {
        waterline.teardown(function(err2) {
          return done(err1 || err2);
        });
      });
    }
  });


  /////////////////////////////////////////////////////
  // TEST METHODS
  ////////////////////////////////////////////////////

  var lastValue;


  it('should generate sequential values', function(done) {
    var records = [];
    for(var i=0; i<3; i++) {
      records.push({ name: 'ais_' + i });
    }

    AutoIncModel.create(records, function(err, records) {
      if (err) return done(err);
      assert(records[0].id < records[1].id);
      assert(records[1].id < records[2].id);

      lastValue = records[2].id;
      done();
    });
  });

  it('should continue auto-incrementing from the last provided larger value', function(done) {
    AutoIncModel.create({ id: lastValue + 20, name: 'FooBar+20' }, function(err, record) {
      if (err) return done(err);
      assert.equal(record.id, lastValue + 20, 'Create item with a given larger than last id');

      AutoIncModel.create({ name: 'FooBar+21' }, function(err, user) {
        if (err) return done(err);
        assert.equal(user.id, lastValue + 21, 'AutoInc id should follow the previous given value');
        done();
      });
    });
  });

  it('should not update the auto-incrementing counter on smaller values', function(done) {
    AutoIncModel.create({ id: lastValue + 10, name: 'FooBar+10' }, function(err, user) {
      if (err) return done(err);
      assert.equal(user.id, lastValue + 10, 'Create item with a given smaller than last id');

      AutoIncModel.create({ name: 'FooBar+22' }, function(err, user) {
        if (err) return done(err);
        assert.equal(user.id, lastValue + 22,  'AutoInc should continue from the largest id to avoid clashing later');
        done();
      });
    });
  });

});
