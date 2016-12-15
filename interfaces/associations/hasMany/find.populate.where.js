var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association', function() {
    describe('.find', function() {
      var Customer;

      before(function(done) {
        var records = [
          {
            name: 'hasMany find where', capital : 1000
          }, 
          {
            name: 'hasMany find where', capital : 2000
          }
        ];

        Associations.Customer.createEach(records)
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          Associations.Customer.find({ name: 'hasMany find where'})
          .sort([{capital: 'asc'}])
          .exec(function(err, customers) {
            if (err) {
              return done(err);
            }

            Customer = customers[0];

            var payments = [];
            for(var i=0; i<8; i++) {
              if(i < 4) payments.push({ amount: i, a_customer: customers[0].id });
              if(i >= 4) payments.push({ amount: i, a_customer: customers[1].id });
            }

            Associations.Payment.createEach(payments, function(err, payments) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it('should return only payments less than or equal to 2', function(done) {
        Associations.Customer.find({ name: 'hasMany find where' })
        .populate('payments', { 
          where: {
            amount: { 
              '<': 2 
            }
          }, 
          limit: 2, 
          sort: [{ amount: 'asc' }]
        })
        .sort([{capital: 'asc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customers));
          assert.equal(customers.length, 2);

          assert(_.isArray(customers[0].payments));
          assert(_.isArray(customers[1].payments));

          assert.equal(customers[0].payments.length, 2);

          assert.equal(customers[0].payments[0].amount, 0);
          assert.equal(customers[0].payments[1].amount, 1);

          assert.equal(customers[1].payments.length, 0);

          return done();
        });
      });

      it('should return payments using skip and limit', function(done) {
        Associations.Customer.find({ name: 'hasMany find where' })
        .populate('payments', { 
          skip: 1, 
          limit: 2, 
          sort: [{ amount: 'asc' }]
        })
        .sort([{capital: 'asc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customers));
          assert.equal(customers.length, 2);

          assert(_.isArray(customers[0].payments));
          assert(_.isArray(customers[1].payments));

          assert.equal(customers[0].payments.length, 2);
          assert.equal(customers[0].payments[0].amount, 1);
          assert.equal(customers[0].payments[1].amount, 2);

          assert.equal(customers[1].payments.length, 2);
          assert.equal(customers[1].payments[0].amount, 5);
          assert.equal(customers[1].payments[1].amount, 6);

          return done();
        });
      });

      it('should allow filtering by primary key', function(done) {
        // Find the payments
        Associations.Payment.findOne({ amount: 1, a_customer: Customer.id })
        .exec(function(err, payment) {
          if (err) {
            return done(err);
          }

          Associations.Customer.find({ name: 'hasMany find where' })
          .populate('payments', {
            where : { 
              id: payment.id 
            }, 
            sort : [{amount : 'asc'}]
          })
          .sort([{capital: 'asc'}])
          .exec(function(err, customers) {
            if (err) {
              return done(err);
            }
    
            assert(_.isArray(customers));
            assert.equal(customers.length, 2);

            assert(_.isArray(customers[0].payments));
            assert(_.isArray(customers[1].payments));

            assert.equal(customers[0].payments.length, 1);
            assert.equal(customers[0].payments[0].amount, 1);
            assert.equal(customers[1].payments.length, 0);
            
            return done();
          });
        });
      });
    });
  });
});
