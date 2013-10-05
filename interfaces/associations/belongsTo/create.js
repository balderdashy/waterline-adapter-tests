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
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var customerId;

      before(function(done) {
        Customer.create({ name: 'belongsTo add' }).exec(function(err, cust) {
          if(err) return done(err);
          customerId = cust.id;
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a foreign key value when passed an association key', function(done) {
        Payment.create({ amount: 1, customer: customerId }).exec(function(err, payment) {
          if(err) return done(err);
          assert(payment.customer.toString() === customerId.toString());
          done();
        });
      });
    });

  });
});
