var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('association .remove()', function() {

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customerRecord, paymentRecord;

        // Create A Customer and a payment
        before(function(done) {
          Associations.Customer.create({ name: 'hasMany add' }, function(err, model) {
            if(err) return done(err);

            customerRecord = model;

            Associations.Payment.create({ amount: 1, customer: model.id }, function(err, payment) {
              if(err) return done(err);

              paymentRecord = payment;

              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should remove the customer_id foreign key from the payment', function(done) {
          customerRecord.payments.remove(paymentRecord.id);
          customerRecord.save(function(err) {
            assert(!err);

            // Look up the customer again to be sure the payment was added
            Associations.Customer.findOne(customerRecord.id)
            .populate('payments')
            .exec(function(err, data) {
              assert(!err);

              assert(data.payments.length === 0);
              done();
            });
          });
        });
      });

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customerRecord;

        before(function(done) {
          Associations.Customer.create({ name: 'hasMany add' }, function(err, model) {
            if(err) return done(err);
            customerRecord = model;
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should error when an object is passed in', function(done) {
          customerRecord.payments.remove({ amount: 1337 });
          customerRecord.save(function(err) {
            assert(err);
            assert(Array.isArray(err));
            assert(err.length === 1);
            assert(err[0].type === 'remove');

            done();
          });
        });
      });

    });
  });
});
