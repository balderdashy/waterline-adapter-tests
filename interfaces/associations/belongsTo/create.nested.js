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
            name: 'belongsTo nested create'
          }
        };


        Associations.Payment.create(data).exec(function(err, payment) {
          if(err) return done(err);
          assert(payment.customer.toString());

          Associations.Payment.findOne(payment.id)
          .populate('customer')
          .exec(function(err, paymnt) {
            if(err) return done(err);
            assert(paymnt.customer.name === 'belongsTo nested create');
            done();
          });
        });
      });
    });

  });
});
