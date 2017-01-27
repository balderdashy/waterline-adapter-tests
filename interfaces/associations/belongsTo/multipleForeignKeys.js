var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Multiple Belongs To Association', function() {
    describe('create', function() {
      var customer_1_id;
      var customer_2_id;

      before(function(done) {
        Associations.Customer_many.create({ name: 'manyAssociations uno add' })
        .exec(function(err, cust) {
          if (err) {
            return done(err);
          }
  
          customer_1_id = cust.id;

          Associations.Customer_many.create({ name: 'manyAssociations dos add' })
          .exec(function(err, cust) {
            if (err) {
              return done(err);
            }

            customer_2_id = cust.id;
            
            return done();
          });
        });
      });

      it('should create multiple foreign key values when passed association keys', function(done) {
        Associations.Payment_many.create({ 
          amount: 1, 
          customer: customer_1_id, 
          patron: customer_2_id 
        })
        .exec(function(err, payment) {
          if (err) {
            return done(err);
          }
          
          assert.equal(payment.customer.toString(), customer_1_id.toString());
          assert.equal(payment.patron.toString(), customer_2_id.toString());
          
          return done();
        });
      });

      it('should populate values only for specified keys', function(done) {
        Associations.Payment_many.create({ 
          amount: 10, 
          customer: customer_1_id, 
          patron: customer_2_id 
        })
        .exec(function(err) {
          if (err) {
            return done(err);
          }

          Associations.Payment_many.findOne({ amount: 10 })
          .populate('patron')
          .exec(function(err, payment) {
            if (err) {
              return done(err);
            }

            assert(payment.patron);
            assert.equal(payment.patron.id.toString(), customer_2_id.toString());
            assert.equal(payment.customer.toString(), customer_1_id.toString());

            return done();
          });
        });
      });
    });
  });
});
