var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Belongs To Association', function() {
    describe('create', function() {
      var customerId;

      before(function(done) {
        Associations.Customer.create({ 
          name: 'belongsTo add' 
        })
        .exec(function(err, cust) {
          if (err) {
            return done(err);
          }

          customerId = cust.id;
          
          return done();
        });
      });

      it('should create a foreign key value when passed an association key', function(done) {
        Associations.Payment.create({ 
          amount: 1, 
          a_customer: customerId 
        })
        .exec(function(err, payment) {
          if (err) {
            return done(err);
          }

          assert.equal(payment.a_customer.toString(), customerId.toString());
          
          return done();
        });
      });
    });
  });
});
