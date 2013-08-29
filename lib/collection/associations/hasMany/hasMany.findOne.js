var Waterline = require('waterline'),
    PaymentFixture = require('../../../fixtures/associations/belongsTo'),
    CustomerFixture = require('../../../fixtures/associations/hasMany'),
    assert = require('assert');

describe('Collection', function() {
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
    var Customer, Payment;

    // Create a Customer and 4 payments
    before(function(done) {
      customerModel.create({ name: 'hasMany findOne' }, function(err, customer) {
        if(err) return done(err);

        // cache customer
        Customer = customer;

        var payments = [];

        for(var i=0; i<4; i++) {
          payments.push({ amount: i, customer: customer.id });
        }

        paymentModel.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    describe('.findOne', function() {

      it('should return payments when the populate criteria is added', function(done) {
        customerModel.findOne({ id: Customer.id })
        .populate('payments')
        .exec(function(err, customer) {
          assert(Array.isArray(customer.payments));
          assert(customer.payments.length === 4);
          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        customerModel.findOne({ id: Customer.id })
        .exec(function(err, customer) {
          var obj = customer.toJSON();
          assert(!obj.payments);
          done();
        });
      });

    });
  });
});
