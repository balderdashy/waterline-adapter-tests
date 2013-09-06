var Waterline = require('waterline'),
    Taxi = require('../support/manyToMany.taxi.fixture'),
    Driver = require('../support/manyToMany.driver.fixture'),
    assert = require('assert');

describe.skip('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var customerModel, paymentModel;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(Taxi);
    waterline.loadCollection(Driver);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      customerModel = collections.customer;
      paymentModel = collections.payment;

      done();
    });
  });


  describe('Many To Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Customer, Payment;

    // Create a Customer and 4 payments
    // before(function(done) {
    //   customerModel.create({}, function(err, customer) {
    //     if(err) return done(err);

    //     // cache customer
    //     Customer = customer;

    //     var payments = [];

    //     for(var i=0; i<4; i++) {
    //       payments.push({ amount: i, customer: customer.id });
    //     }

    //     paymentModel.createEach(payments, function(err) {
    //       if(err) return done(err);
    //       done();
    //     });
    //   });
    // });

    describe.skip('.findOne', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
        customerModel.findOne({ id: Customer.id })
        .populate('payments')
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
