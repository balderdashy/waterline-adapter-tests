var Waterline = require('waterline'),
    Fixtures = require('../../../fixtures/associations/many-to-many'),
    assert = require('assert');

describe('Collection', function() {
  var customerModel, paymentModel, Collections;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(Fixtures.customer);
    waterline.loadCollection(Fixtures.payment);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Collections = collections;
      customerModel = collections.customermany;
      paymentModel = collections.paymentmany;

      done();
    });
  });


  describe('Many To Many Association', function() {
    var Customer, Payment;

    // Create a Customer and 4 payments
    before(function(done) {
      customerModel.create({ name: 'foo' }, function(err, customer) {
        if(err) return done(err);

        // cache customer
        Customer = customer;

        var payments = [];

        for(var i=0; i<4; i++) {
          payments.push({ amount: i });
        }

        paymentModel.createEach(payments, function(err, payments) {
          if(err) return done(err);
          Payment = payments[0];
          done();
        });
      });
    });


    describe('association .add()', function() {

      describe('with an object', function() {
        var customer;

        before(function(done) {
          customerModel.find()
          .populate('payments')
          .exec(function(err, customers) {
            if(err) return done(err);
            customer = customers[0];
            done();
          });
        });

        it('should create a new payment association', function(done) {
          customer.payments.add({ amount: 1337 });
          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            customerModel.find()
            .populate('payments')
            .exec(function(err, customers) {
              if(err) return done(err);

              assert(customers[0].payments.length === 1);
              assert(customers[0].payments[0].amount === 1337);

              done();
            });
          });
        });
      });

      describe('with an id', function() {
        var customer;

        before(function(done) {
          customerModel.find()
          .populate('payments')
          .exec(function(err, customers) {
            if(err) return done(err);
            customer = customers[0];
            done();
          });
        });

        it('should link a payment to a customer through a join table', function(done) {

          customer.payments.add(Payment.id);

          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            customerModel.findOne(customer.id)
            .populate('payments')
            .exec(function(err, data) {
              if(err) return done(err);

              assert(data.payments.length === 1);
              assert(data.payments[0].amount === 0);
              done();
            });
          });
        });
      });

    });
  });
});
