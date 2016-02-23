var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord, paymentRecord;

    before(function(done) {
      Associations.Customer.create({ name: 'foobar' }, function(err, customer) {
        if(err) return done(err);

        Associations.Payment.create({ amount: 1, customer: customer.id }, function(err, payment) {
          if(err) return done(err);

          // Cache customer and payment
          customerRecord = customer;
          paymentRecord = payment;

          done();
        });
      });
    });

    describe.skip('dynamic finders', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the dynamic finder method is used for findOne', function(done) {
        Associations.Payment.findOneByA_customer(customerRecord.id)
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(payment.a_customer);
          assert.equal(payment.a_customer.id, customerRecord.id);
          assert.equal(payment.a_customer.name, 'foobar');

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for find', function(done) {
        Associations.Payment.findByA_customer(customerRecord.id)
        .exec(function(err, payments) {
          assert.ifError(err);

          assert(payments[0].a_customer);
          assert.equal(payments[0].a_customer.id, customerRecord.id);
          assert.equal(payments[0].a_customer.name, 'foobar');

          done();
        });
      });

    });
  });
});
