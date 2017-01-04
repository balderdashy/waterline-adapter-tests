var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association', function() {
    describe('.find', function() {
      before(function(done) {
        var customerRecords = [
          { name: 'hasMany find pop' },
          { name: 'hasMany find pop' }
        ];

        Associations.Customer.createEach(customerRecords, function(err, customers) {
          if (err) {
            return done(err);
          }

          Associations.Customer.find({ name: 'hasMany find pop'})
          .sort([{id: 'asc'}])
          .exec(function(err, customers) {
            if (err) {
              return done(err);
            }

            // Create 8 payments, 4 from one customer, 4 from another
            var payments = [];
            for(var i=0; i<8; i++) {
              if(i < 4) payments.push({ amount: i, a_customer: customers[0].id });
              if(i >= 4) payments.push({ amount: i, a_customer: customers[1].id });
            }

            Associations.Payment.createEach(payments, function(err, payments) {
              if (err) {
                return done(err);
              }

              return done();
            });
          });
        });
      });

      it('should return payments when the populate criteria is added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customers));
          assert.equal(customers.length, 2);

          assert(_.isArray(customers[0].payments));
          assert(_.isArray(customers[1].payments));

          assert.equal(customers[0].payments.length, 4);
          assert.equal(customers[1].payments.length, 4);

          return done();
        });
      });

      it('should return all the populated records when a limit clause is used', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments')
        .limit(1)
        .sort([{id: 'asc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }
  
          assert(_.isArray(customers));
          assert.strictEqual(customers.length, 1);

          assert(_.isArray(customers[0].payments));
          assert.equal(customers[0].payments.length, 4);
          assert.equal(customers[0].payments[0].amount, 0);

          return done();
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
        .populate('payments', { sort: [{ amount: 'asc' }]})
        .skip(1)
        .sort([{id: 'asc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customers));
          assert.equal(customers.length, 1);

          assert(_.isArray(customers[0].payments));
          assert.equal(customers[0].payments.length, 4);
          assert.equal(customers[0].payments[0].amount, 4);

          done();
        });
      });

      it('should return an empty array when no child records are found', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .populate('payments', { where: { amount: -1 }})
        .skip(1)
        .sort([{id: 'asc'}])
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(customers));
          assert.equal(customers.length, 1);

          assert(_.isArray(customers[0].payments));
          assert.equal(customers[0].payments.length, 0);

          done();
        });
      });      

      it('should add a flag to not serialize association object when the populate is not added', function(done) {
        Associations.Customer.find({ name: 'hasMany find pop' })
        .exec(function(err, customers) {
          if (err) {
            return done(err);
          }

          assert(!customers[0].payments);

          return done();
        });
      });
    });
  });
});
