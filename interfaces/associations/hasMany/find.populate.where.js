var assert = require('assert');
var _ = require('lodash');
var util = require('util');






describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      Associations.Customer.createEach([{
        name: 'hasMany find where'
      }, {
        name: 'hasMany find where'
      }],
      function(err, customers) {
        if(err) return done(err);

        var payments = [];

        for(var i=0; i<8; i++) {
          if(i < 4) payments.push({ amount: i, customer: customers[0].id });
          if(i >= 4) payments.push({ amount: i, customer: customers[1].id });
        }

        Associations.Payment.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return only payments less than or equal to 2', function(done) {
        Associations.Customer.find({ name: 'hasMany find where' })
        .populate('payments', { amount: { '<': 2 }})
        .exec(function(err, customers) {
          assert(!err,err);

          assert(Array.isArray(customers));
          assert(customers.length === 2);

          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));

          assert(customers[0].payments.length === 2,
          'expecting customers[0] to have 2 payments, but actually she looks like: \n'+util.inspect(customers[0],false, null));

          assert(customers[0].payments[0].amount === 0);
          assert(customers[0].payments[1].amount === 1);

          assert(customers[1].payments.length === 0);

          done();
        });
      });

      it('should return payments using skip and limit', function(done) {
        Associations.Customer.find({ name: 'hasMany find where' })
        .populate('payments', { skip: 1, limit: 2 })
        .exec(function(err, customers) {
          assert(!err);

          assert(Array.isArray(customers));
          assert(customers.length === 2);

          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));

          assert(customers[0].payments.length === 2);
          assert(customers[0].payments[0].amount === 1);
          assert(customers[0].payments[1].amount === 2);

          assert(customers[1].payments.length === 2, 'expected 2 payments but got '+customers[1].payments.length);
          assert(customers[1].payments[0].amount === 5);
          assert(customers[1].payments[1].amount === 6);

          done();
        });
      });

    });
  });
});
