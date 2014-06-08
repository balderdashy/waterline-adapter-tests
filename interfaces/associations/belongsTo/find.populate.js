var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customers, payments;

    before(function(done) {
      Associations.Customer.createEach([{ name: 'foo' }, { name: 'bar' }], function(err, models) {
        if(err) return done(err);

        customers = models;

        var paymentRecords = [
          { amount: 1, type: 'belongsTo find', customer: customers[0].id },
          { amount: 2, type: 'belongsTo find', customer: customers[1].id }
        ];

        Associations.Payment.createEach(paymentRecords, function(err, models) {
          if(err) return done(err);
          payments = models;
          done();
        });
      });
    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the populate criteria is added', function(done) {
        Associations.Payment.find({ type: 'belongsTo find' })
        .populate('customer')
        .exec(function(err, payments) {
          assert(!err, err);

          assert(Array.isArray(payments));
          assert(payments.length === 2, 'expected 2 payments, but got '+payments.length+': '+require('util').inspect(payments, false, null));

          assert(payments[0].customer);
          assert(payments[0].customer.id === customers[0].id);
          assert(payments[0].customer.name === 'foo');

          assert(payments[1].customer);
          assert(payments[1].customer.id === customers[1].id);
          assert(payments[1].customer.name === 'bar');

          var obj = payments[0].toJSON();
          assert(!obj.customer.name);

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.find()
        .exec(function(err, payments) {
          assert(!err);

          assert(!_.isPlainObject(payments[0].customer));
          assert(!_.isPlainObject(payments[1].customer));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Associations.Payment.find()
        .populate('customer')
        .exec(function(err, payments) {
          assert(!err);

          var obj = payments[0].toJSON();

          assert(!obj.type);
          assert(obj.customer);
          assert(obj.customer.createdAt);
          assert(!obj.customer.name);

          done();
        });
      });
    });

  });
});
