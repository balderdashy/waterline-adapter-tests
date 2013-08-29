var Waterline = require('waterline'),
    Fixtures = require('../../../fixtures/associations/many-to-many'),
    assert = require('assert');

describe('Collection', function() {
  var customerModel, paymentModel;

  before(function(done) {
    var waterline = new Waterline();

    waterline.loadCollection(Fixtures.customer);
    waterline.loadCollection(Fixtures.payment);

    waterline.initialize({ adapters: { test: Adapter }}, function(err, collections) {
      if(err) return done(err);

      customerModel = collections.customermany;
      paymentModel = collections.paymentmany;

      done();
    });
  });


  describe('Many To Many Association', function() {

    describe('association .remove()', function() {

      describe('with an id', function() {
        var customer, payment;

        before(function(done) {
          customerModel.create({ name: 'manymany add' })
          .exec(function(err, model) {
            if(err) return done(err);
            customer = model;

            paymentModel.create({ amount: 20 })
            .exec(function(err, pmt) {
              if(err) return done(err);
              payment = pmt;

              customer.payments.add(payment.id);
              customer.save(function(err) {
                if(err) return done(err);

                customerModel.findOne(customer.id)
                .populate('payments')
                .exec(function(err, cust) {
                  if(err) return done(err);
                  customer = cust;
                  done();
                });
              });
            });
          });
        });

        it('should remove the record from the join table', function(done) {

          assert(customer.payments.length === 1);

          customer.payments.remove(payment.id);

          customer.save(function(err) {
            if(err) return done(err);

            // Look up the customer again to be sure the payment was added
            customerModel.findOne(customer.id)
            .populate('payments')
            .exec(function(err, data) {
              if(err) return done(err);

              assert(data.payments.length === 0);
              done();
            });
          });
        });
      });

      describe('with an object', function() {
        var customer;

        before(function(done) {
          customerModel.create({ name: 'manymany add' })
          .exec(function(err, model) {
            if(err) return done(err);
            customer = model;
            done();
          });
        });

        it('should error when an object is passed in', function(done) {

          customer.payments.remove({ amount: 1337 });

          customer.save(function(err) {
            assert(err);
            assert(Array.isArray(err));
            assert(err.length === 1);
            assert(err[0].type === 'remove');

            done();
          });
        });
      });

    });
  });
});
