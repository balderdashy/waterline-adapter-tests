var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('1:m association :: .update()', function() {
    describe('update nested associations with custom primary keys()', function() {
      describe('with single level depth', function() {

        describe('when association doesn\'t exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customer;

          before(function(done) {

            var data = {
              username: 'has many nested',
              name: 'has many nested update'
            };

            Associations.Customerbelongscustom.create(data)
            .exec(function(err, values) {
              if(err) return done(err);
              Customer = values;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should create new payments', function(done) {

            var data = {
              name: '1:m update nested - updated',
              payments: [
                { invoice: 300, amount: 1 }
              ]
            };

            Associations.Customerbelongscustom.update({ username: Customer.username })
            .set(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customerbelongscustom.findOne(values[0].username)
              .populate('payments')
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.equal(model.payments.length, 1);
                assert.equal(model.payments[0].invoice, 300);
                assert.equal(model.payments[0].amount, 1);
                done();
              });

            });
          });
        });


        describe('when associations already exist', function() {

          /////////////////////////////////////////////////////
          // TEST SETUP
          ////////////////////////////////////////////////////

          var Customer;

          before(function(done) {

            var data = {
              username: '1:m update nested',
              name: '1:m update nested',
              payments: [
                { invoice: 302, amount: 1 },
                { invoice: 303, amount: 2 }
              ]
            };

            Associations.Customerbelongscustom.create(data)
            .exec(function(err, customer) {
              if(err) return done(err);
              Customer = customer;
              done();
            });

          });


          /////////////////////////////////////////////////////
          // TEST METHODS
          ////////////////////////////////////////////////////

          it('should reset associations with the updated associations', function(done) {

            var data = {
              name: '1:m update nested - updated',
              payments: [
                { invoice: 304, amount: 3 },
                { invoice: 305, amount: 4 },
                { invoice: 306, amount: 5 }
              ]
            };

            Associations.Customerbelongscustom.update({ username: Customer.username })
            .set(data)
            .exec(function(err, values) {
              assert.ifError(err);

              // Look up the customer again to be sure the payments were added
              Associations.Customerbelongscustom.findOne(values[0].username)
              .populate('payments', { sort: 'amount ASC' })
              .exec(function(err, model) {
                assert.ifError(err);
                assert.equal(model.name, '1:m update nested - updated');
                assert.equal(model.payments.length, 3);

                assert.equal(model.payments[0].invoice, 304);
                assert.equal(model.payments[0].amount, 3);

                assert.equal(model.payments[1].invoice, 305);
                assert.equal(model.payments[1].amount, 4);

                assert.equal(model.payments[2].invoice, 306);
                assert.equal(model.payments[2].amount, 5);
                done();
              });

            });
          });
        });

      });
    });
  });
});
