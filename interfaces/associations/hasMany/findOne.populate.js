var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customerRecord;

    before(function(done) {
      Associations.Customer.create({ name: 'hasMany findOne' }, function(err, customer) {
        if(err) return done(err);

        customerRecord = customer;

        var payments = [];

        for(var i=0; i<4; i++) {
          payments.push({ amount: i, customer: customer.id });
        }

        Associations.Payment.createEach(payments, function(err) {
          if(err) return done(err);
          done();
        });
      });
    });

    describe('.findOne', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
       Associations. Customer.findOne({ id: customerRecord.id })
        .populate('payments')
        .exec(function(err, customer) {
          assert(!err);

          assert(Array.isArray(customer.payments));
          assert(customer.payments.length === 4);
          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.findOne({ id: customerRecord.id })
        .exec(function(err, customer) {
          assert(!err);

          var obj = customer.toJSON();
          assert(!obj.payments);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Customer.findOne({ id: customerRecord.id })
        .populate('payments')
        .exec(function(err, customer) {
          assert(!err);

          var obj = customer.toJSON();

          assert(Array.isArray(obj.payments));
          assert(obj.payments.length === 4);
          assert(!obj.payments[0].hasOwnProperty('type'));
          assert(!obj.payments[1].hasOwnProperty('type'));
          assert(!obj.payments[2].hasOwnProperty('type'));
          assert(!obj.payments[3].hasOwnProperty('type'));

          done();
        });
      });

    });
  });
});
