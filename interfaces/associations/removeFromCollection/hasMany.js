var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Plural Has Many Associations', function() {
    describe('.removeFromCollection()', function() {
      var customers;
      var payments;
      
      before(function(done) {
        var customerRecords = [
          { name: 'plural addToCollection' },
          { name: 'plural addToCollection' }
        ];

        Associations.Customer.createEach(customerRecords, function(err, _customers) {
          if (err) {
            return done(err);
          }

          // Create 4 payments
          var paymentRecords = [];
          for(var i=0; i<4; i++) {
            paymentRecords.push({ amount: i, a_customer: _.first(_customers).id });
          }

          Associations.Payment.createEach(paymentRecords, function(err, _payments) {
            if (err) {
              return done(err);
            }
            
            customers = _customers;
            payments = _payments;

            return done();
          });
        });
      });

      it('should remove payments from a customer', function(done) {
        var parentId = _.first(customers).id;
        var childrenId = _.first(payments).id;

        Associations.Customer.removeFromCollection(parentId, 'payments', childrenId)
        .exec(function(err) {
          if (err) {
            return done(err);
          }

          Associations.Customer.findOne({ id: parentId })
          .populate('payments')
          .exec(function(err, customer) {
            if (err) {
              return cb(err);
            }

            assert(customer);
            assert(_.isArray(customer.payments));
            assert.equal(customer.payments.length, 3);

            return done();
          });
        });
      });
    });
  });
});
