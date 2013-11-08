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


  describe('Multiple Belongs To Association', function() {
    describe('create', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var customer_1_id, customer_2_id;

      before(function(done) {
        Customer.create({ name: 'manyAssociations uno add' }).exec(function(err, cust) {
          if(err) return done(err);
          customer_1_id = cust.id;

          Customer.create({ name: 'manyAssociations dos add' }).exec(function(err, cust) {
            if(err) return done(err);
            customer_2_id = cust.id;
            done();
          });
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create multiple foreign key values when passed association keys', function(done) {
        Payment.create({ amount: 1, customer: customer_1_id, patron: customer_2_id }).exec(function(err, payment) {
          if(err) return done(err);
          assert(payment.customer.toString() === customer_1_id.toString());
          assert(payment.patron.toString() === customer_2_id.toString());
          done();
        });
      });

      it('should populate values only for specified keys', function(done) {

        Payment.create({ amount: 10, customer: customer_1_id, patron: customer_2_id }).exec(function(err) {
          if(err) return done(err);

          Payment.findOne({ amount: 10 })
          .populate('patron')
          .exec(function(err, payment) {
            if(err) return done(err);

            var obj = payment.toJSON();

            assert(obj.patron);
            assert(obj.patron.id.toString() === customer_2_id.toString());
            assert(obj.customer.toString() === customer_1_id.toString());

            done();
          });
        });
      });
    });
  });

});
