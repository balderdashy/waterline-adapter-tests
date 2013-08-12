var PaymentFixture = require('../../fixtures/associations/belongsTo'),
    CustomerFixture = require('../../fixtures/associations/hasMany'),
    assert = require('assert');

describe('Collection', function() {
  var customerModel, paymentModel;

  before(function(done) {

    // Create the Customer Model
    new CustomerFixture({ adapters: { test: Adapter }}, function(err, coll) {
      if(err) return done(err);
      customerModel = coll;

      // Create the Payment Model
      new PaymentFixture({ adapters: { test: Adapter }}, function(err, coll) {
        if(err) return done(err);
        paymentModel = coll;

        done();
      });
    });
  });


  describe('Has Many Association', function() {
    var Customer, Payment;

    // Create a Customer and 4 payments
    before(function(done) {
      customerModel.create({}, function(err, customer) {
        if(err) return done(err);

        // cache customer
        Customer = customer;

        var payments = [];

        for(var i=0; i<4; i++) {
          payments.push({ amount: i, customer: customer.id });
        }

        paymentModel.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });
      });
    });


    /**
     * Search using basic criteria with a joins array
     */

    describe('basic criteria query', function() {

      it('should return payments when the joins clause is added', function(done) {
        customerModel.findOne({
          where: { id: Customer.id },
          joins: ['payment']
        }).exec(function(err, customer) {
          assert(Array.isArray(customer.payments));
          assert(customer.payments.length === 4);
          done();
        });
      });

    });


    /**
     * Search using .populate()
     */

    describe('populate', function() {

      it('should return payments when the populate criteria is added', function(done) {
        customerModel.findOne({ id: Customer.id })
        .populate('payment')
        .exec(function(err, customer) {
          assert(Array.isArray(customer.payments));
          assert(customer.payments.length === 4);
          done();
        });
      });

      it('should not return a payments object when the populate is not added', function(done) {
        customerModel.findOne({ id: Customer.id })
        .exec(function(err, customer) {
          assert(!customer.payments);
          done();
        });
      });

    });
  });
});
