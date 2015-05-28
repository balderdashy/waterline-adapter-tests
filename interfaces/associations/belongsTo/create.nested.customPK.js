var assert = require('assert');
var _ = require('lodash');
var util = require('util');

describe('Association Interface', function() {

  describe('Belongs To Associations', function() {
    describe('create nested association when a custom primary key is used', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a parent and child record and store the foreign key on the parent', function(done) {
        var data = {
          invoice: 1000,
          amount: 200,
          customer: {
            username: 'belongsTo',
            title: 'belongsTo nested create'
          }
        };

        // Create the Parent and Child records
        Associations.Paymentbelongscustom.create(data)
        .exec(function(err, payment) {
          assert(!err, err);

          // Ensure the foreignKey get set
          assert.equal(payment.customer, 'belongsTo');

          // Look up the values and test that populate works on the custom values
          Associations.Paymentbelongscustom.findOne(payment.invoice)
          .populate('customer')
          .exec(function(err, _payment) {
            assert(!err, err);

            // Test the parent is correct
            assert.equal(_payment.invoice, 1000);

            // Test the child is correct
            assert.equal(_payment.customer.username, 'belongsTo');
            assert.equal(_payment.customer.title, 'belongsTo nested create');

            done();
          });
        });
      });
    });

  });
});
