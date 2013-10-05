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


  describe('Has Many Association', function() {
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer;

        before(function(done) {
          Customer.create({ name: 'hasMany add' }, function(err, model) {
            if(err) return done(err);

            customer = model;
            Payment.create({ amount: 1, customer: customer.id }, done);
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
            Customer.findOne(customer.id)
            .populate('payments')
            .exec(function(err, model) {
              if(err) return done(err);

              assert(model.payments.length === 2);
              assert(model.payments[1].amount === 1337);
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
            { name: 'hasMany add 1' },
            { name: 'hasMany add 2' }
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
