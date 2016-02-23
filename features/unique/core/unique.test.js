var assert = require('assert');
var _ = require('lodash');

describe('unique attribute feature', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Waterline = require('waterline');
  var defaults = { migrate: 'alter' };
  var waterline;

  var UniqueFixture = require('../support/unique.fixture.js')
  var UniqueModel;

  var id0, id1, email0;


  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(UniqueFixture);

    var connections = { uniqueConn: _.clone(Connections.test) };

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: connections, defaults: defaults }, function(err, ontology) {
      if(err) return done(err);
      UniqueModel = ontology.collections['unique'];

      // Insert 3 Records
      var records = [];
      for(var i=0; i<3; i++) {
        records.push({name: 'testUnique' + i, email: 'email' + i, type: 'unique'});
      }

      UniqueModel.createEach(records, function(err, records) {
        if(err) return done(err);
        id0 = records[0].id;
        id1 = records[1].id;
        email0 = records[0].email.toString();
        done();
      });
    });
  });

  after(function(done) {
    if(!Adapter.hasOwnProperty('drop')) {
      waterline.teardown(done);
    } else {
      UniqueModel.drop(function(err1) {
        waterline.teardown(function(err2) {
          return done(err1 || err2);
        });
      });
    }
  });


  /////////////////////////////////////////////////////
  // TEST METHODS
  ////////////////////////////////////////////////////

  it('should error when creating with a duplicate value', function(done) {
    UniqueModel.create({ email: email0, type: 'unique' }, function(err, records) {
      assert(err);
      assert(!records);
      UniqueModel.find({type: 'unique'}).exec(function(err, records) {
        assert.ifError(err);
        assert.equal(records.length, 3);
        done();
      });
    });
  });

  it('should error when updating with a duplicate value', function(done) {
    UniqueModel.update(id1, { email: email0 }).exec(function(err, records) {
      assert(err);
      assert(!records);
      UniqueModel.findOne(id1).exec(function(err, record) {
        assert.ifError(err);
        assert.notEqual(record.email, email0);
        done();
      });
    });
  });

  it('should work (do nothing) when updating the field of an existing record to the same value', function(done) {
    UniqueModel.update(id0, { id: id0, name: 'testUnique0', email: email0, type: 'unique' }).exec(function(err, records) {
      assert(!err, 'Expected no error when updating to the same value');
      assert.equal(records.length, 1);
      assert.equal(records[0].id, id0);
      assert.equal(records[0].email, email0);
      done();
    });
  });

  it('should work when updating a unique field to the same value based on search parameters', function(done) {
    UniqueModel.update({email: email0}, { email: email0 }).exec(function(err, records) {
      assert(!err, 'Expected no error when updating to the same value on searched records');
      assert.equal(records.length, 1);
      assert.equal(records[0].id, id0);
      assert.equal(records[0].email, email0);
      done();
    });
  });

});
