var Waterline = require('waterline'),
    PaymentManyFixture = require('../support/multipleAssociations.fixture').payment,
    CustomerManyFixture = require('../support/multipleAssociations.fixture').customer,
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Customer, Payment;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(CustomerManyFixture);
    waterline.loadCollection(PaymentManyFixture);

    Events.emit('fixture', CustomerManyFixture);
    Events.emit('fixture', PaymentManyFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Customer = collections.customer_many;
      Payment = collections.payment_many;

      done();
    });
  });


  describe('Multiple Has Many Associations', function() {
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer;

        before(function(done) {
          Customer.create({ name: 'manyAssociations uno hasMany add' }, function(err, model) {
            if(err) return done(err);

            customer = model;
            Payment.create({ amount: 1, customer: customer.id }, done);
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new payment and transaction association', function(done) {
          customer.payments.add({ amount: 1337 });
          customer.transactions.add({ amount: 100 });
          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            Customer.findOne(customer.id)
            .populate('payments')
            .populate('transactions')
            .exec(function(err, model) {
              if(err) return done(err);

              assert(model.payments.length === 2);
              assert(model.payments[1].amount === 1337);

              assert(model.transactions.length === 1);
              assert(model.transactions[0].amount === 100);
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

        before(function(done) {

          var records = [
            { name: 'manyAssociations hasMany add uno' },
            { name: 'manyAssociations uno hasMany dos' }
          ];

          Customer.createEach(records, function(err, models) {
            if(err) return done(err);

            customer = models[0];
            Payment.create({ amount: 1, customer: models[1].id }, function(err, paymentModel) {
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
            Customer.findOne(customer.id)
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
