var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    assert = require('assert');

describe.skip('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var customerModel, paymentModel;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(CustomerFixture);
    waterline.loadCollection(PaymentFixture);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      customerModel = collections.customer;
      paymentModel = collections.payment;

      done();
    });
  });


  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var Customer, Payment;

    // Create 2 Customers and 4 payments per customer
    before(function(done) {
      customerModel.createEach([{ name: 'hasMany find' }, { name: 'hasMany find' }], function(err, customers) {
        if(err) return done(err);

        var payments = [[], []];

        for(var i=0; i<8; i++) {
          if(i < 4) payments[0].push({ amount: i, customer: customers[0].id });
          if(i >= 4) payments[1].push({ amount: i, customer: customers[1].id });
        }

        paymentModel.createEach(payments[0], function(err) {
          if(err) return done(err);
          paymentModel.createEach(payments[1], function(err) {
            if(err) return done(err);
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
        customerModel.find({ name: 'hasMany find' })
        .populate('payments')
        .exec(function(err, customers) {
          assert(Array.isArray(customers));
          assert(customers.length === 2);
          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));
          assert(customers[0].payments.length === 4);
          assert(customers[1].payments.length === 4);
          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        customerModel.find({ name: 'hasMany find' })
        .exec(function(err, customers) {
          var obj = customers[0].toJSON();
          assert(!obj.payments);
          done();
        });
      });

    });
  });
});
