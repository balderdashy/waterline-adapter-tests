var Waterline = require('waterline'),
    PaymentFixture = require('./support/belongsTo.fixture'),
    CustomerFixture = require('./support/hasMany.fixture'),
    assert = require('assert');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Customer, Payment;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(CustomerFixture);
    waterline.loadCollection(PaymentFixture);

    Events.emit('fixture', CustomerFixture);
    Events.emit('fixture', PaymentFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, colls) {
      if(err) return done(err);
      Customer = colls.customer;
      Payment = colls.payment;
      done();
    });
  });


  describe('find with associations', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Customers = [];

    before(function(done) {

      Customer.createEach([{}, {}], function(err, customers) {
        if(err) return done(err);

        // cache customers
        Customers = customers;

        var payments = [];
        var i = 0;

        for(i=0; i<2; i++) payments.push({ amount: i, customer: customers[0].id });
        for(i=0; i<2; i++) payments.push({ amount: i, customer: customers[1].id });

        Payment.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });

      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should group associations under the parent key', function(done) {
      Customer.find({ id: [Customers[0].id, Customers[1].id]})
      .populate('payments')
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
