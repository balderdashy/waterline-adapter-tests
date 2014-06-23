var assert = require('assert');
var _ = require('lodash');
var util = require('util');



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

        // console.log('----- Associations.Paymentbelongs.create');
        Associations.Paymentbelongs.create(data).exec(function(err, payment) {
          assert(!err, err);
          assert(payment.customer);

          // console.log('----- Associations.Paymentbelongs.findOne');
          Associations.Paymentbelongs.findOne(payment.id)
          .populate('customer')
          .exec(function(err, _paymnt) {
            assert(!err,'Tried to execute .findOne() with criteria:\n'+
              util.inspect(payment.id, false, null)+'\nBut got error:\n'+
              util.inspect(err, false, null));
            assert(_paymnt.customer.title === 'belongsTo nested create',
              'Expecting `_paymnt.customer.title`==="belongsTo nested create", but instead `_paymnt` ==>'+
              util.inspect(_paymnt, false, null));
            done();
          });
        });
      });
    });

  });
});
