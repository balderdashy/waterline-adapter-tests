var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Multiple Has Many Associations', function() {
    describe('association .add()', function() {

      describe('with an object', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer;

        before(function(done) {
          Associations.Customer_many.create({ name: 'manyAssociations uno hasMany add' }, function(err, model) {
            if(err) return done(err);

            customer = model;
            Associations.Payment_many.create({ amount: 1, customer: customer.id }, done);
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should create a new payment and transaction association', function(done) {
          customer.payments.add({ amount: 1337 });
          customer.transactions.add({ amount: 100 });
          customer.save(function(err) {
            assert(!err);

            // Look up the customer again to be sure the payment was added
            Associations.Customer_many.findOne(customer.id)
            .populate('payments')
            .populate('transactions')
            .exec(function(err, customer) {
              assert(!err);

              assert(customer.payments.length === 2);
              assert(customer.payments[1].amount === 1337);

              assert(customer.transactions.length === 1, 'Expected customer to have 1 transaction, but actually it has '+customer.transactions.length+', see?  \n'+require('util').inspect(customer,false,null));
              assert(customer.transactions[0].amount === 100);
              done();
            });
          });
        });
      });

      describe('with an id', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var customer, payment;

        before(function(done) {

          var records = [
            { name: 'manyAssociations hasMany add uno' },
            { name: 'manyAssociations uno hasMany dos' }
          ];

          Associations.Customer_many.createEach(records, function(err, models) {
            if(err) return done(err);

            customer = models[0];
            Associations.Payment_many.create({ amount: 1, customer: models[1].id }, function(err, paymentModel) {
              if(err) return done(err);

              payment = paymentModel;
              done();
            });
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should link the payment to another association', function(done) {
          customer.payments.add(payment.id);
          customer.save(function(err) {
            assert(!err);

            // Look up the customer again to be sure the payment was added
            Associations.Customer_many.findOne(customer.id)
            .populate('payments')
            .exec(function(err, data) {
              assert(!err);

              assert(data.payments.length === 1);
              assert(data.payments[0].amount === 1);
              done();
            });
          });
        });
      });

    });
  });
});
