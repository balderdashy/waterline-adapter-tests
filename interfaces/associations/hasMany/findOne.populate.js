var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association', function() {
    describe('.findOne', function() {
      var customerRecord;

      before(function(done) {
        Associations.Customer.create({ name: 'hasMany findOne' }, function(err, customer) {
          if (err) {
            return done(err);
          }

          customerRecord = customer;

          var payments = [];
          for(var i=0; i<4; i++) {
            payments.push({ amount: i, a_customer: customer.id });
          }

          Associations.Payment.createEach(payments, function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });
      });

      it('should return payments when the populate criteria is added', function(done) {
       Associations. Customer.findOne({ id: customerRecord.id })
        .populate('payments')
        .exec(function(err, customer) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customer.payments));
          assert.equal(customer.payments.length, 4);
          
          return done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.findOne({ id: customerRecord.id })
        .exec(function(err, customer) {
          if (err) {
            return done(err);
          }

          assert(!customer.payments);

          return done();
        });
      });
    });
  });
});
