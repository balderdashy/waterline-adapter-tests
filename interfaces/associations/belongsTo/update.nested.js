var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:1 association :: .update()', function() {
    describe('update nested associations()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Payment;

          before(function(done) {

            Associations.Payment.create({ amount: 1 }).exec(function(err, values) {
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
              a_customer: {
                name: 'belongsTo nested update'
              }
            };

            Associations.Payment.update({ id: Payment.id }, data).exec(function(err, payment) {
              assert.ifError(err);

              Associations.Payment.findOne(payment[0].id)
              .populate('a_customer')
              .exec(function(err, paymnt) {
                assert.ifError(err);
                assert.equal(paymnt.a_customer.name, 'belongsTo nested update');
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
              amount: 200,
              a_customer: {
                name: 'belongsTo nested update'
              }
            };

            Associations.Payment.create(data).exec(function(err, payment) {
              if(err) return done(err);
              Payment = payment;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              amount: 100,
              a_customer: {
                name: 'belongsTo nested update - updated'
              }
            };

            Associations.Payment.update({ id: Payment.id }, data).exec(function(err, values) {
              assert.ifError(err);

              // Look up the payment again to be sure the new customer was added
              Associations.Payment.findOne(Payment.id)
              .populate('a_customer')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.strictEqual(model.amount, 100);
                assert(model.a_customer);
                assert.equal(model.a_customer.name, 'belongsTo nested update - updated');
                done();
              });

            });
          });
        });

        describe('when association have primary keys', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customers, Payment;

          before(function(done) {

            Associations.Customer.create([{ name: 'foo' }, { name: 'bar' }]).exec(function(err, customers) {
              if(err) return done(err);
              Customers = customers;

              Associations.Payment.create({ amount: 100, a_customer: customers[0].id })
              .exec(function(err, payment) {
                if(err) return done(err);
                Payment = payment;
                done();
              });
            });
          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should update association values', function(done) {

            var data = {
              amount: 200,
              a_customer: Customers[1]
            };

            Associations.Payment.update({ id: Payment.id }, data).exec(function(err, values) {
              assert(!err, err);

              // Look up the payment again to be sure the customer was linked
              Associations.Payment.findOne(values[0].id)
              .populate('a_customer')
              .exec(function(err, model) {
                assert.ifError(err);

                assert.strictEqual(model.amount, 200);
                assert.equal(model.a_customer.name, 'bar');

                done();
              });

            });
          });
        });

      });
    });
  });
});
