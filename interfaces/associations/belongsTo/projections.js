var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Belongs To Association', function() {
    describe('projections', function() {
      var customer;
      var payment;

      before(function(done) {
        var customerData = {
          name: 'foo',
          title: 'tester'
        };

        var paymentData = {
          amount: 1,
          type: 'credit'
        };

        Associations.Customerbelongs.create(customerData, function(err, _customer) {
          if (err) {
            return done(err);
          }

          customer = _customer;
          paymentData.customer = customer.id;

          Associations.Paymentbelongs.create(paymentData, function(err, _payment) {
            if (err) {
              return done(err);
            }

            payment = _payment;

            return done();
          });
        });
      });


      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // NOT YET SUPPORTED IN WATERLINE CORE
      // (search for "FUTURE" in `forge-stage-two-query` in the Waterline repo for more information)
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // it.skip('should filter populated attributes when projections are used', function(done) {
      //   Associations.Paymentbelongs.findOne({ id: payment.id })
      //   .populate('customer', { select: ['title'] })
      //   .exec(function(err, payment) {
      //     if (err) {
      //       return done(err);
      //     }

      //     assert(payment);
      //     assert(payment.customer);

      //     assert.equal(_.keys(payment.customer).length, 2);
      //     assert(payment.customer.id);
      //     assert.equal(payment.customer.title, 'tester');

      //     return done();
      //   });
      // });

    });
  });
});
