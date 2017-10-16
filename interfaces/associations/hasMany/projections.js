var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association', function() {
    describe('projections', function() {
      var customer;
      var payment;

      before(function(done) {
        var customerData = {
          name: 'foo',
          title: 'tester',
          capital : 123
        };

        var paymentData = {
          amount: 100,
          type: 'check'
        };

        Associations.Customer.create(customerData, function(err, _customer) {
          if (err) {
            return done(err);
          }

          customer = _customer;
          paymentData.a_customer = customer.id;

          Associations.Payment.create(paymentData, function(err, _payment) {
            if (err) {
              return done(err);
            }

            payment = _payment;

            return done();
          });
        });
      });

      it('should filter populated attributes when `select` projections are used', function(done) {
        Associations.Customer.findOne({ id: customer.id })
        .populate('payments', { select: ['amount'] })
        .exec(function(err, customer) {
          if (err) {
            return done(err);
          }

          assert(customer);
          assert(_.isArray(customer.payments));
          assert.equal(customer.payments.length, 1);

          assert.equal(_.keys(customer.payments[0]).length, 3);
          assert(customer.payments[0].id);
          assert.equal(customer.payments[0].a_customer, customer.id);
          assert.equal(customer.payments[0].amount, 100);

          return done();
        });
      });

      it('should filter populated attributes when `omit` projections are used', function(done) {
        Associations.Customer.findOne({ id: customer.id })
        .populate('payments', { omit: ['amount'] })
        .exec(function(err, customer) {
          if (err) {
            return done(err);
          }

          assert(customer);
          assert(_.isArray(customer.payments));
          assert.equal(customer.payments.length, 1);
          assert.equal(_.keys(customer.payments[0]).length, 7);
          assert(customer.payments[0].id);
          assert.equal(customer.payments[0].a_customer, customer.id);
          assert(_.isUndefined(customer.payments[0].amount));

          return done();
        });
      });

    });
  });
});
