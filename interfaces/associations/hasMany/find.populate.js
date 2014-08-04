var util = require('util');
var assert = require('assert');
var _ = require('lodash');




describe('Association Interface', function() {

  describe('Has Many Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var customerRecords = [
        { name: 'hasMany find pop' },
        { name: 'hasMany find pop' }
      ];

      Associations.Customer.createEach(customerRecords, function(err, customers) {
        if(err) return done(err);

        Associations.Customer.find({ name: 'hasMany find pop'})
        .sort('id asc')
        .exec(function(err, customers) {
          if(err) return done(err);

          // Create 8 payments, 4 from one customer, 4 from another
          var payments = [];
          for(var i=0; i<8; i++) {
            if(i < 4) payments.push({ amount: i, customer: customers[0].id });
            if(i >= 4) payments.push({ amount: i, customer: customers[1].id });
          }

          Associations.Payment.createEach(payments, function(err, payments) {
            if(err) return done(err);
            done();
          });
        });
      });
    });

    describe('.find', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return payments when the populate criteria is added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert(customers.length === 2, 'expected 2 customers, got these customers:'+require('util').inspect(customers, false, null));

          assert(Array.isArray(customers[0].payments));
          assert(Array.isArray(customers[1].payments));

          assert(customers[0].payments.length === 4);
          assert(customers[1].payments.length === 4);

          done();
        });
      });

      it('should return all the populated records when a limit clause is used', function(done) {

        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments', {sort: 'amount asc'})
        .limit(1)
        .sort('id asc')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert(customers.length === 1);

          assert(Array.isArray(customers[0].payments));
          assert(customers[0].payments.length === 4, 'Expected customers[0] to have 4 payments, but got '+customers[0].payments.length+'.  Customers: '+require('util').inspect(customers, false, null));
          assert(customers[0].payments[0].amount === 0);

          done();
        });
      });

      // TODO: pull this stuff into a separate test:
      ////////////////////////////////////////////////////////////////////////////////////

      // e.g.
      // Associations.Customer.find({ name: 'hasMany find' })
      //   .populate('payments', {
      //     limit: 2,
      //     sort: {amount: -1}
      //   })
      //   .limit(2)
      //   .sort('id DESC')

      // it('should return expected child records for ALL parent records when populate..limit is used');
      // it('should return expected child records for ALL parent records when populate..skip is used');
      // it('should return expected child records for ALL parent records when populate..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..sort is used');
      // it('should return expected child records for ALL parent records when populate..sort..limit is used');
      // it('should return expected child records for ALL parent records when populate..sort..skip is used');
      // it('should return expected child records for ALL parent records when populate..sort..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..where is used');
      // it('should return expected child records for ALL parent records when populate..where..limit is used');
      // it('should return expected child records for ALL parent records when populate..where..skip is used');
      // it('should return expected child records for ALL parent records when populate..where..limit..skip is used');

      // it('should return expected child records for ALL parent records when populate..where..limit..sort is used');
      // it('should return expected child records for ALL parent records when populate..where..skip..sort is used');
      // it('should return expected child records for ALL parent records when populate..where..limit..skip..sort is used');
      ////////////////////////////////////////////////////////////////////////////////////

      it('should return all the populated records when a skip clause is used', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments', { sort: { amount: 1 } })
        .skip(1)
        .sort('id asc')
        .exec(function(err, customers) {
          assert(!err, err);

          assert(Array.isArray(customers));
          assert(customers.length === 1);

          assert(Array.isArray(customers[0].payments));
          assert(customers[0].payments.length === 4);
          assert(customers[0].payments[0].amount === 4,
            'Expected customers[0].payments[0].amount === 4, but customers[0] ==>\n'+
            util.inspect(customers[0]));

          done();
        });
      });

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .exec(function(err, customers) {
          assert(!err);

          var obj = customers[0].toJSON();
          assert(!obj.payments);

          done();
        });
      });

      it('should call toJSON on all associated records if available', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .exec(function(err, customers) {
          assert(!err);

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
