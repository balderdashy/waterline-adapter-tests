var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Customer, Payment;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(CustomerFixture);
    waterline.loadCollection(PaymentFixture);

    Events.emit('fixture', CustomerFixture);
    Events.emit('fixture', PaymentFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Customer = collections.customer;
      Payment = collections.payment;

      done();
    });
  });


  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customers, payments;

    before(function(done) {
      Customer.createEach([{ name: 'foo' }, { name: 'bar' }], function(err, models) {
        if(err) return done(err);

        customers = models;

        var paymentRecords = [
          { amount: 1, customer: customers[0].id },
          { amount: 2, customer: customers[1].id }
        ];

        Payment.createEach(paymentRecords, function(err, models) {
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
        Payment.find()
        .populate('customer')
        .exec(function(err, payments) {
          if(err) return done(err);

          assert(Array.isArray(payments));
          assert(payments.length === 2);

          assert(payments[0].customer);
          assert(payments[0].customer.id === customers[0].id);
          assert(payments[0].customer.name === 'foo');

          assert(payments[1].customer);
          assert(payments[1].customer.id === customers[1].id);
          assert(payments[1].customer.name === 'bar');

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Payment.find()
        .exec(function(err, payments) {
          if(err) return done(err);

          assert(typeof payments[0].customer === 'number');
          assert(typeof payments[1].customer === 'number');
          done();
        });
      });
    });

  });
});
