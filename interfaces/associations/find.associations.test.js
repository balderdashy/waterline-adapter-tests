var assert = require('assert');
var _ = require('@sailshq/lodash');
var util = require('util');

describe('Association Interface', function() {
  describe('find with associations', function() {
    var Customers = [];
    var payments = [];

    before(function(done) {
      Associations.Customer.createEach([{}, {}], function(err, customers) {
        if (err) {
          return done(err);
        }

        // cache customers
        Customers = customers;

        payments = [];
        var i = 0;

        for(i=0; i<2; i++) {
          payments.push({ amount: i, a_customer: customers[0].id });
        }

        for(i=0; i<2; i++) {
          payments.push({ amount: i, a_customer: customers[1].id });
        }

        Associations.Payment.createEach(payments, function(err, payments) {
          if (err) {
            return done(err);
          }

          return done();
        });
      });
    });

    it('should group associations under the parent key', function(done) {
      Associations.Customer.find({ 
        id: [Customers[0].id, Customers[1].id]
      })
      .populate('payments')
      .sort([{id: 'asc'}])
      .exec(function(err, customers) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(customers));
        assert.strictEqual(customers.length, 2);

        assert(_.isArray(customers[0].payments));
        assert(_.isArray(customers[1].payments));

        assert.strictEqual(customers[0].payments.length, 2, 'Expected 2 payments, but got customers[0] ==> ' +require('util').inspect(customers[0], false, null));
        assert.strictEqual(customers[1].payments.length, 2);

        assert.equal(customers[0].payments[0].amount, 0);
        assert.equal(customers[0].payments[1].amount, 1, 'Expected amount of second associated payment to === 1, but instead here is the customer:'+util.inspect(customers[0], false, null));
        assert.equal(customers[1].payments[0].amount, 0);
        assert.equal(customers[1].payments[1].amount, 1);

        return done();
      });
    });
  });
});
