var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var Customer, Payment, waterline;

  before(function(done) {
    waterline = new Waterline();

    waterline.loadCollection(CustomerFixture);
    waterline.loadCollection(PaymentFixture);

    Events.emit('fixture', CustomerFixture);
    Events.emit('fixture', PaymentFixture);

    Connections.associations = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);

      Customer = colls.collections.customer;
      Payment = colls.collections.payment;

      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });


  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord, paymentRecord;

    before(function(done) {
      Customer.create({ name: 'foobar' }, function(err, customer) {
        if(err) return done(err);

        Payment.create({ amount: 1, customer: customer.id }, function(err, payment) {
          if(err) return done(err);

          // Cache customer and payment
          customerRecord = customer;
          paymentRecord = payment;

          done();
        });
      });
    });

    describe.skip('dynamic finders', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the dynamic finder method is used for findOne', function(done) {
        Payment.findOneByCustomer(customerRecord.id)
        .exec(function(err, payment) {
          if(err) return done(err);

          assert(payment.customer);
          assert(payment.customer.id === customerRecord.id);
          assert(payment.customer.name === 'foobar');

          done();
        });
      });

      it('should return customer when the dynamic finder method is used for find', function(done) {
        Payment.findByCustomer(customerRecord.id)
        .exec(function(err, payments) {
          if(err) return done(err);

          assert(payments[0].customer);
          assert(payments[0].customer.id === customerRecord.id);
          assert(payments[0].customer.name === 'foobar');

          done();
        });
      });

    });
  });
});
