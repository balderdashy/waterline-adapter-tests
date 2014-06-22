var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Belongs To Associations', function() {
    describe('create nested association', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should create a parent and child record and store the foreign key on the parent', function(done) {
        var data = {
          amount: 200,
          customer: {
            title: 'belongsTo nested create'
          }
        };


        Associations.Paymentbelongs.create(data).exec(function(err, payment) {
          assert(!err, err);
          assert(payment.customer);

          Associations.Paymentbelongs.findOne(payment.id)
          .populate('customer')
          .exec(function(err, paymnt) {
            assert(!err,err);
            assert(paymnt.customer.title === 'belongsTo nested create');
            done();
          });
        });
      });
    });

  });
});
