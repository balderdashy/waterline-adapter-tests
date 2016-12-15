var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Belongs To Association', function() {
    describe('.findOne()', function() {
      var customerRecord;
      var paymentRecord;

      before(function(done) {
        Associations.Customer.create({ name: 'foobar' }, function(err, customer) {
          if (err) {
            return done(err);
          }

          Associations.Payment.create({ 
            amount: 1, 
            a_customer: customer.id 
          })
          .exec(function(err, payment) {
            if (err) {
              return done(err);
            }

            // Cache customer and payment
            customerRecord = customer;
            paymentRecord = payment;

            return done();
          });
        });
      });
    
      it('should return customer when the populate criteria is added', function(done) {
        Associations.Payment.findOne({ id: paymentRecord.id })
        .populate('a_customer')
        .exec(function(err, payment) {
          if (err) {
            return done(err);
          }

          assert(payment.a_customer);
          assert.equal(payment.a_customer.id, customerRecord.id);
          assert.equal(payment.a_customer.name, 'foobar');

          return done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.findOne({ id: paymentRecord.id })
        .exec(function(err, payment) {
          if (err) {
            return done(err);
          }

          assert(!_.isPlainObject(payment.a_customer));

          return done();
        });
      });
    });
  });
});
