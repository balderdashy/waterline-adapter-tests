var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

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
        if(err) {
          return done(err);
        }

        customer = _customer;
        paymentData.a_customer = customer.id;

        Associations.Payment.create(paymentData, function(err, _payment) {
          if(err) {
            return done(err);
          }

          payment = _payment;
          done();
        });
      });
    });

    describe('projections', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should filter populated attributes when projections are used', function(done) {
        Associations.Customer.findOne({ id: customer.id })
        .populate('payments', { select: ['amount'] })
        .exec(function(err, customer) {
          assert.ifError(err);
          assert(customer);
          assert(_.isArray(customer.payments));
          assert.equal(customer.payments.length, 1);

          // JSON stringify the record to remove any virtual functions such
          // as associations with .add/.remove
          var record = customer.toJSON();

          assert.equal(_.keys(record.payments[0]).length, 3);
          assert(record.payments[0].id);
          assert.equal(record.payments[0].a_customer, customer.id);
          assert.equal(record.payments[0].amount, 100);
          done();
        });
      });
    });
  });
});
