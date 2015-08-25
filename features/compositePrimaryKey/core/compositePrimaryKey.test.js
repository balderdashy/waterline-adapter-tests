var assert = require('assert');
var _ = require('lodash');

describe('compositePrimaryKey feature', function () {
  var Waterline = require('waterline');
  var defaults = { migrate: 'alter' };
  var waterline;

  var Fixture = require('../support/fixture.js');
  var Model;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Fixture);

    var connections = { compositePrimaryKeyConnection: _.clone(Connections.test) };

    Adapter.teardown('compositePrimaryKeyConnection', function adapterTeardown(){
      waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, ontology) {
        if(err) return done(err);
        Model = ontology.collections['compositeprimarykey'];
        done();
      });
    });
  });
  after(function(done) {
    if(!Adapter.hasOwnProperty('drop')) {
      waterline.teardown(done);
    } else {
      Model.drop(function(err1) {
        waterline.teardown(function(err2) {
          return done(err1 || err2);
        });
      });
    }
    done()
  });

  it('should insert unique records', function (done) {
    var records = [
      { name: '1st', pkOne: 1, pkTwo: 'bar' },
      { name: '2nd', pkOne: 2, pkTwo: 'baz' },
      { name: '3rd', pkOne: 3, pkTwo: 'bar' },
      { name: '4th', pkOne: 4, pkTwo: 'baz' }
    ];

    Model.create(records)
      .then(function (records) {
        assert(records.length, 4);
        done();
      })
      .catch(done)
  })
  it('should enforce composite uniqueness', function (done) {
    var records = [
      { name: '5th', pkOne: 1, pkTwo: 'bar' }
    ];
    Model.create(records)
      .then(function (records) {
        done(new Error('should not have inserted unique records, but did anyway'));
      })
      .catch(function (err) {
        assert(err)
        done();
      })
  })
})
