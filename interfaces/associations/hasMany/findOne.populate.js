var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
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

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      Customer = collections.customer;
      Payment = collections.payment;

      done();
    });
  });


  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord;

    before(function(done) {
      Customer.create({ name: 'hasMany findOne' }, function(err, customer) {
        if(err) return done(err);

        customerRecord = customer;

        var payments = [];

        for(var i=0; i<4; i++) {
          payments.push({ amount: i, customer: customer.id });
        }

        Payment.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    describe('.findOne', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
        Customer.findOne({ id: customerRecord.id })
        .populate('payments')
        .exec(function(err, customer) {
          if(err) return done(err);

          assert(Array.isArray(customer.payments));
          assert(customer.payments.length === 4);
          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Customer.findOne({ id: customerRecord.id })
        .exec(function(err, customer) {
          if(err) return done(err);

          var obj = customer.toJSON();
          assert(!obj.payments);

          done();
        });
      });

    });
  });
});
