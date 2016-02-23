var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord, paymentRecord;

    before(function(done) {
      Associations.Customer.create({ name: 'foobar' }, function(err, customer) {
        if(err) return done(err);

        Associations.Payment.create({ amount: 1, a_customer: customer.id }, function(err, payment) {
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
        Associations.Payment.findOne({ id: paymentRecord.id })
        .populate('a_customer')
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(payment.a_customer);
          assert.equal(payment.a_customer.id, customerRecord.id);
          assert.equal(payment.a_customer.name, 'foobar');

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.findOne({ id: paymentRecord.id })
        .exec(function(err, payment) {
          assert.ifError(err);

          assert(!_.isPlainObject(payment.a_customer));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Associations.Payment.findOne({ id: paymentRecord.id })
        .populate('a_customer')
        .exec(function(err, payment) {
          assert.ifError(err);

          var obj = payment.toJSON();

          assert(!obj.type);
          assert(obj.a_customer);
          assert(obj.a_customer.createdAt);
          assert(!obj.a_customer.name);

          done();
        });
      });
    });

  });
});
