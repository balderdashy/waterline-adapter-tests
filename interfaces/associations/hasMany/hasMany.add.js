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


  describe('Has Many Association', function() {

    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer;

        // Create A Customer and a payment
        before(function(done) {
          customerModel.create({ name: 'hasMany add' }, function(err, customerModel) {
            if(err) return done(err);

            customer = customerModel;
            paymentModel.create({ amount: 1, customer: customer.id }, done);
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new payment association', function(done) {
          customer.payments.add({ amount: 1337 });
          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            customerModel.findOne(customer.id)
            .populate('payments')
            .exec(function(err, customerModel) {
              if(err) return done(err);

              assert(customerModel.payments.length === 2);
              assert(customerModel.payments[1].amount === 1337);
              done();
            });
          });
        });
      });

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer, payment;

        // Create A Customer and a payment
        before(function(done) {
          customerModel.create({ name: 'hasMany add' }, function(err, customerModel) {
            if(err) return done(err);

            customer = customerModel;
            paymentModel.create({ amount: 1, customer: customer.id + 1 }, function(err, paymentModel) {
              if(err) return done(err);

              payment = paymentModel;
              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should link the payment to another association', function(done) {
          customer.payments.add(payment.id);
          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            customerModel.findOne(customer.id)
            .populate('payments')
            .exec(function(err, data) {
              if(err) return done(err);

              assert(data.payments.length === 1);
              assert(data.payments[0].amount === 1);
              done();
            });
          });
        });
      });

    });
  });
});
