var assert = require('assert'),
    _ = require('lodash');

describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var customerRecords = [
        { name: 'hasMany find' },
        { name: 'hasMany find' }
      ];

      Associations.Customer.createEach(customerRecords, function(err, customers) {
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

      it('should return payments when the populate criteria is added', function(done) {
        Associations.Customer.find({ name: 'hasMany find' })
        .populate('payments')
        .exec(function(err, customers) {
          if(err) return done(err);

          assert(Array.isArray(customers));
          assert(customers.length === 2);

          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));

          assert(customers[0].payments.length === 4);
          assert(customers[1].payments.length === 4);

          done();
        });
      });

      it('should return all the populated records when a limit clause is used', function(done) {
        Associations.Customer.find({ name: 'hasMany find' })
        .populate('payments')
        .limit(1)
        .exec(function(err, customers) {
          if(err) return done(err);

          assert(Array.isArray(customers));
          assert(customers.length === 1);

          assert(Array.isArray(customers[0].payments));
          assert(customers[0].payments.length === 4);
          assert(customers[0].payments[0].amount === 0);

          done();
        });
      });

      it('should return all the populated records when a skip clause is used', function(done) {
        Associations.Customer.find({ name: 'hasMany find' })
        .populate('payments')
        .skip(1)
        .exec(function(err, customers) {
          if(err) return done(err);

          assert(Array.isArray(customers));
          assert(customers.length === 1);

          assert(Array.isArray(customers[0].payments));
          assert(customers[0].payments.length === 4);
          assert(customers[0].payments[0].amount === 4);

          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.find({ name: 'hasMany find' })
        .exec(function(err, customers) {
          if(err) return done(err);

          var obj = customers[0].toJSON();
          assert(!obj.payments);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Customer.find({ name: 'hasMany find' })
        .populate('payments')
        .exec(function(err, customers) {
          if(err) return done(err);

          var obj = customers[0].toJSON();

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
