var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    assert = require('assert');

describe.skip('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var customerModel, paymentModel;

  before(function(done) {

    var waterline = new Waterline();

    waterline.loadCollection(CustomerFixture);
    waterline.loadCollection(PaymentFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      customerModel = collections.customer;
      paymentModel = collections.payment;

      done();
    });
  });


  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Customer, Payment;

    // Create a Customer and 4 payments
    before(function(done) {
      customerModel.create({}, function(err, customer) {
        if(err) return done(err);

        paymentModel.create({ amount: 1, customer: customer.id }, function(err, payment) {
          if(err) return done(err);

          // Cache customer and payment
          Customer = customer;
          Payment = payment;

          done();
        });
      });
    });

    describe('populate', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the populate criteria is added', function(done) {
        paymentModel.findOne({ id: Payment.id })
        .populate('customer')
        .exec(function(err, payment) {
          assert(payment.customer);
          assert(payment.customer.id === Customer.id);
          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        paymentModel.findOne({ id: Payment.id })
        .exec(function(err, payment) {
          assert(typeof payment.customer === 'number');
          done();
        });
      });

    });

    describe('dynamic finder', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it.skip('should return customer when the dynamic finder method is used', function(done) {
        paymentModel.findOneByCustomer(Customer.id)
        .exec(function(err, payment) {
          assert(payment.customer);
          assert(payment.customer.id === Customer.id);
          done();
        });
      });

    });
  });
});
