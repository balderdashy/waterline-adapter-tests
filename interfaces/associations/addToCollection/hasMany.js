var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Plural Has Many Associations', function() {
    describe('.addToCollection()', function() {
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
            paymentRecords.push({ amount: i });
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

      it('should add payments to a customer', function(done) {
        var parentId = _.first(customers).id;
        var childrenIds = _.map(payments, function(payment) {
          return payment.id;
        });

        console.log('\n\n\n\n------------------------------------------\n');

        console.log('%%%%%%%%%% Associations.Customer.addToCollection('+util.inspect(parentId)+', \'payments\', '+util.inspect(childrenIds)+')');
        Associations.Customer.addToCollection(parentId, 'payments', childrenIds)
        .meta({logMongoS3Qs: true})
        .exec(function(err) {
          if (err) { return done(err); }

          console.log('%%%%%%%%%%% Associations.Customer.findOne({ id: '+util.inspect(parentId)+' }).populate(\'payments\')');
          Associations.Customer.findOne({ id: parentId })
          .populate('payments')
          .meta({logMongoS3Qs: true})
          .exec(function(err, customer) {
            if (err) { return done(err); }
            console.log('%%%%%%%%% => got customer:',customer);

            try {
              assert(customer);
              assert(_.isArray(customer.payments));
              assert.equal(customer.payments.length, 4);
            } catch (e) { return done(e); }

            return done();
          });
        });
      });
    });
  });
});
