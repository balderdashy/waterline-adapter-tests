var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association', function() {
    describe('.find (nested modifiers)', function() {
      var Customer;

      before(function(done) {
        var parentRecord = { name: 'hasMany find where populate nested' };
        Associations.Customer.create(parentRecord)
        .exec(function(err, customer) {
          if (err) {
            return done(err);
          }
          var childRecords = [];
          // { amount: 1, type: 'odd', note: 'low' },
          // { amount: 2, type: 'even', note: 'low' },
          // { amount: 3, type: 'odd', note: 'low' },
          // { amount: 4, type: 'even', note: 'low' },
          // { amount: 5, type: 'odd', note: 'high' },
          // { amount: 6, type: 'even', note: 'high' },
          // { amount: 7, type: 'odd', note: 'high' },
          // { amount: 8, type: 'even', note: 'high' },

          for(var i=1; i<=8; i++) {
            childRecords.push({
              amount: i,
              note: i <= 4 ? 'low' : 'high',
              type: i % 2 ? 'odd' : 'even',
              a_customer: customer.id
            });
          }

          Associations.Payment.createEach(childRecords).exec(done);

        });

      });


      it('should return the correct payments', function(done) {
        Associations.Customer.find({ name: 'hasMany find where populate nested' })
        .populate('payments', { 
          where: { 
            or: [
              { 
                and: [
                  { note: 'low' },
                  { or: 
                    [
                      { amount: { '>=': 2 } },
                      { type: 'even' }
                    ]
                  }
                ]
              }, 
              { 
                and: [
                  { note: 'high' },
                  {
                    or: [
                      { type: { startsWith: 'o' } },
                      { amount: 6 }
                    ]
                  }
                ]
              }
            ]
          },
          sort: 'amount desc'
        })
        .sort([{name: 'desc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }
          var customer = customers[0];
          assert(customer);
          assert(_.isArray(customer.payments));
          assert.equal(customer.payments.length, 6);

          // Expected results:
          // { amount: 2, type: 'even', note: 'low' },
          // { amount: 3, type: 'odd', note: 'low' },
          // { amount: 4, type: 'even', note: 'low' },
          // { amount: 5, type: 'odd', note: 'high' },
          // { amount: 6, type: 'even', note: 'high' },
          // { amount: 7, type: 'odd', note: 'high' },
          assert.equal(customer.payments[0].amount, 7);
          assert.equal(customer.payments[1].amount, 6);
          assert.equal(customer.payments[2].amount, 5);
          assert.equal(customer.payments[3].amount, 4);
          assert.equal(customer.payments[4].amount, 3);
          assert.equal(customer.payments[5].amount, 2);


          return done();
        });
      });


    });
  });
});
