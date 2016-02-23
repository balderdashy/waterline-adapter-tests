var assert = require('assert');
var _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {
    describe('create nested associations when a custom primary key is used()', function() {
      describe('with single level depth', function() {

        describe('and objects', function() {

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              username: 'foo',
              name: 'has many nested',
              payments: [
                { invoice: 2000, amount: 1 },
                { invoice: 2001, amount: 2 }
              ]
            };

            Associations.Customerbelongscustom.create(data)
            .exec(function(err, values) {
              if(err) return done(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customerbelongscustom.findOne(values.username)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {

                if(err) return done(err);
                assert.equal(model.payments.length, 2);

                assert.equal(model.payments[0].invoice, 2000);
                assert.equal(model.payments[0].amount, 1);

                assert.equal(model.payments[1].invoice, 2001);
                assert.equal(model.payments[1].amount, 2);

                done();
              });

            });
          });
        });

        describe('and objects mixed with ids', function() {

          before(function(done) {
            Associations.Paymentbelongscustom.create({ invoice: 200, amount: 1 })
            .exec(function(err, payment) {
              if(err) return done(err);
              done();
            });
          });

          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create a new customer and payment association', function(done) {

            var data = {
              username: 'mixed custom create',
              name: 'has many nested',
              payments: [
                200,
                { invoice: 201, amount: 2 }
              ]
            };

            Associations.Customerbelongscustom.create(data)
            .exec(function(err, values) {

              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customerbelongscustom.findOne(values.username)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {
                assert.ifError(err);

                assert.equal(model.payments.length, 2);

                assert.equal(model.payments[0].invoice, 200);
                assert.equal(model.payments[0].amount, 1);

                assert.equal(model.payments[1].invoice, 201);
                assert.equal(model.payments[1].amount, 2);

                done();
              });

            });
          });
        });

      });
    });
  });
});
