var assert = require('assert'),
    _ = require('lodash');
var util = require('util');




describe('Association Interface', function() {

  describe('find with associations', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Customers = [];
    var payments = [];

    before(function(done) {

      Associations.Customer.createEach([{}, {}], function(err, customers) {
        if(err) return done(err);

        // cache customers
        Customers = customers;

        payments = [];
        var i = 0;

        for(i=0; i<2; i++) payments.push({ amount: i, customer: customers[0].id });
        for(i=0; i<2; i++) payments.push({ amount: i, customer: customers[1].id });

        Associations.Payment.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });

      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should group associations under the parent key', function(done) {

      // Associations.Customer.find({ id: [Customers[0].id, Customers[1].id]})
      // .exec()
      // Associations.Payment.find();



      Associations.Customer.find({ id: [Customers[0].id, Customers[1].id]})
      .populate('payments', { sort: { amount: 1 }})
      .sort('id asc')
      .exec(function(err, customers) {
        assert(!err);
        assert(Array.isArray(customers));
        assert(customers.length === 2);

        assert(Array.isArray(customers[0].payments));
        assert(Array.isArray(customers[1].payments));

        assert(customers[0].payments.length === 2, 'Expected 2 payments, but got customers[0] ==> ' +require('util').inspect(customers[0], false, null));
        assert(customers[1].payments.length === 2);

        assert.equal(customers[0].payments[0].amount, 0);
        assert.equal(customers[0].payments[1].amount, 1, 'Expected amount of second associated payment to === 1, but instead here is the customer:'+util.inspect(customers[0], false, null));
        assert.equal(customers[1].payments[0].amount, 0);
        assert.equal(customers[1].payments[1].amount, 1);

        done();
      });
    });
  });

});



// Experiment

// assertv('customers[0].payments[0].amount === 0', 'customers[0]', customers[0]);
// assertv('customers[0].payments[1].amount === 1', 'customers[0]', customers[0]);
// assertv('customers[1].payments[0].amount === 0', 'customers[1]', customers[1]);
// assertv('customers[1].payments[1].amount === 1', 'customers[1]', customers[1]);

// function assertv(expr, exprToLog, exprToLogValue) {
//   var msg = 'Expected `'+expr+'`, but actually `'+exprToLog+'` ==>\n'+require('util').inspect(exprToLogValue, false, null);
//   console.log('running:','assert('+expr+', '+msg+')');
//   eval('assert('+expr+', '+msg+')');
// }
