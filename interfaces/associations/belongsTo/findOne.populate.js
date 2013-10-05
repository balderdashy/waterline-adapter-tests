var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    _ = require('lodash'),
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

    var customerRecord, paymentRecord;

    before(function(done) {
      Customer.create({ name: 'foobar' }, function(err, customer) {
        if(err) return done(err);

        Payment.create({ amount: 1, customer: customer.id }, function(err, payment) {
          if(err) return done(err);

          // Cache customer and payment
          customerRecord = customer;
          paymentRecord = payment;

          done();
        });
      });
    });

    describe('.findOne()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the populate criteria is added', function(done) {
        Payment.findOne({ id: paymentRecord.id })
        .populate('customer')
        .exec(function(err, payment) {
          if(err) return done(err);

          assert(payment.customer);
          assert(_.isPlainObject(payment.customer));
          assert(payment.customer.id === customerRecord.id);
          assert(payment.customer.name === 'foobar');

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Payment.findOne({ id: paymentRecord.id })
        .exec(function(err, payment) {
          if(err) return done(err);

          assert(!_.isPlainObject(payment.customer));

          done();
        });
      });
    });

  });
});
