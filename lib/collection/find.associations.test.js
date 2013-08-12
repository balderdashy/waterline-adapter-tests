var PaymentFixture = require('../fixtures/associations/belongsTo'),
    CustomerFixture = require('../fixtures/associations/hasMany'),
    assert = require('assert');

describe('Collection', function() {
  var customerModel, paymentModel;

  before(function(done) {

    // Create the Customer Model
    new CustomerFixture({ adapters: { test: Adapter }}, function(err, coll) {
      if(err) return done(err);
      customerModel = coll;

      // Create the Payment Model
      new PaymentFixture({ adapters: { test: Adapter }}, function(err, coll) {
        if(err) return done(err);
        paymentModel = coll;

        done();
      });
    });
  });


  describe('find with associations', function() {
    var Customers = [];

    before(function(done) {

      customerModel.createEach([{}, {}], function(err, customers) {
        if(err) return done(err);

        // cache customers
        Customers = customers;

        // create customer 1 payments
        var payments = { c1: [], c2: [] },
            i = 0;

        for(i=0; i<2; i++) payments.c1.push({ amount: i, customer: customers[0].id });
        for(i=0; i<2; i++) payments.c2.push({ amount: i, customer: customers[1].id });

        paymentModel.createEach(payments.c1, function(err) {
          if(err) return done(err);

          // Create customer 2 payments
          paymentModel.createEach(payments.c2, function(err) {
            if(err) return done(err);
            done();
          });
        });

      });
    });


    it('should group associations under the parent key', function(done) {
      customerModel.find({ id: [Customers[0].id, Customers[1].id]})
      .populate('payment')
      .exec(function(err, customers) {
        assert(!err);
        assert(Array.isArray(customers));
        assert(customers.length === 2);

        assert(Array.isArray(customers[0].payments));
        assert(Array.isArray(customers[1].payments));

        assert(customers[0].payments.length === 2);
        assert(customers[1].payments.length === 2);

        assert(customers[0].payments[0].amount === 0);
        assert(customers[0].payments[1].amount === 1);
        assert(customers[1].payments[0].amount === 0);
        assert(customers[1].payments[1].amount === 1);

        done();
      });
    });
  });

});
