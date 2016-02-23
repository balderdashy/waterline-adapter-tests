var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 association :: .update()', function() {
    describe('update nested associations with custom primary keys()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Payment;

          before(function(done) {

            var data = {
              invoice: 100,
              amount: 200
            };

            Associations.Paymentbelongscustom.create(data)
            .exec(function(err, values) {
              if(err) return done(err);
              Payment = values;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer', function(done) {

            var data = {
              amount: 200,
              customer: {
                username: 'belongsTo nested',
                name: 'belongsTo nested update'
              }
            };

            Associations.Paymentbelongscustom.update({ invoice: Payment.invoice })
            .set(data)
            .exec(function(err, payment) {
              assert.ifError(err);

              // Check that the foreign key was set
              assert.equal(payment[0].customer, 'belongsTo nested');

              Associations.Paymentbelongscustom.findOne(payment[0].invoice)
              .populate('customer')
              .exec(function(err, _payment) {
                assert.ifError(err);
                assert.equal(_payment.customer.username, 'belongsTo nested');
                assert.equal(_payment.customer.name, 'belongsTo nested update');
                done();
              });
            });
          });
        });

        describe('when association already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Payment;

          before(function(done) {

            var data = {
              invoice: 101,
              amount: 200,
              customer: {
                username: 'belongsTo nested update',
                name: 'belongsTo nested update'
              }
            };

            Associations.Paymentbelongscustom.create(data)
            .exec(function(err, values) {
              if(err) return done(err);
              Payment = values;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              amount: 100,
              customer: {
                username: 'belongsTo nested update - updated',
                name: 'belongsTo nested update - updated'
              }
            };

            Associations.Paymentbelongscustom.update({ invoice: Payment.invoice })
            .set(data)
            .exec(function(err, payments) {
              assert.ifError(err);

              // Check that the foreign key was set
              assert.equal(payments[0].customer, 'belongsTo nested update - updated');

              // Look up the payment again to be sure the new customer was added
              Associations.Paymentbelongscustom.findOne(Payment.invoice)
              .populate('customer')
              .exec(function(err, _payment) {
                assert.ifError(err);
                assert.equal(_payment.amount, 100);
                assert.equal(_payment.customer.username, 'belongsTo nested update - updated');
                assert.equal(_payment.customer.name, 'belongsTo nested update - updated');
                done();
              });

            });
          });
        });

      });
    });
  });
});
