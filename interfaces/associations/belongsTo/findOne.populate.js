var Waterline = require('waterline'),
    PaymentFixture = require('../support/belongsTo.fixture'),
    CustomerFixture = require('../support/hasMany.fixture'),
    _ = require('lodash'),
    assert = require('assert');

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

    describe('.findOne()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the populate criteria is added', function(done) {
        Payment.findOne({ id: paymentRecord.id })
        .populate('customer')
        .exec(function(err, payment) {
          if(err) return done(err);

          assert(payment.customer);
          assert(payment.customer.id === customerRecord.id);
          assert(payment.customer.name === 'foobar');

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Payment.findOne({ id: paymentRecord.id })
        .exec(function(err, payment) {
          if(err) return done(err);

          assert(!_.isPlainObject(payment.customer));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Payment.findOne({ id: paymentRecord.id })
        .populate('customer')
        .exec(function(err, payment) {
          if(err) return done(err);

          var obj = payment.toJSON();

          assert(!obj.type);
          assert(obj.customer);
          assert(obj.customer.createdAt);
          assert(!obj.customer.name);

          done();
        });
      });
    });

  });
});
