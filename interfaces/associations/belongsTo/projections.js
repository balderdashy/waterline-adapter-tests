var _ = require('lodash');
var assert = require('assert');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

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
        if(err) {
          return done(err);
        }

        customer = _customer;
        paymentData.customer = customer.id;

        Associations.Paymentbelongs.create(paymentData, function(err, _payment) {
          if(err) {
            return done(err);
          }

          payment = _payment;
          return done();
        });
      });
    });

    describe('projections', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should filter populated attributes when projections are used', function(done) {
        Associations.Paymentbelongs.findOne({ id: payment.id })
        .populate('customer', { select: ['title'] })
        .exec(function(err, payment) {
          assert.ifError(err);
          assert(payment);
          assert(payment.customer);

          // JSON stringify the record to remove any virtual functions such
          // as associations with .add/.remove
          var record = payment.toJSON();

          assert.equal(_.keys(record.customer).length, 2);
          assert(record.customer.id);
          assert.equal(record.customer.title, 'tester');
          done();
        });
      });
    });

  });
});
