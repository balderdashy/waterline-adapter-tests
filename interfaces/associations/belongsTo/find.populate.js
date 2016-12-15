var assert = require('assert');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Belongs To Association', function() {
    describe('.find()', function() {
      var customers;
      var payments;

      before(function(done) {
        var records = [
          {
            name: 'foo'
          }, 
          {
            name: 'bar'
          }
        ];

        Associations.Customer.createEach(records, function(err, _customers) {
          if (err) {
            return done(err);
          }

          // Expose results for examination below
          customers = _customers;

          var paymentRecords = [
            {
              amount: 1,
              type: 'belongsTo find',
              a_customer: customers[0].id
            }, 
            {
              amount: 2,
              type: 'belongsTo find',
              a_customer: customers[1].id
            }
          ];

          Associations.Payment.createEach(paymentRecords, function(err, _payments) {
            if (err) {
              return done(err);
            }

            // Expose results for examination below
            payments = _payments;
    
            return done();
          });
        });
      });
    
      it('should return a customer when the populate criteria is added', function(done) {
        Associations.Payment.find({ 
          type: 'belongsTo find'
        })
        .sort([{amount: 'ASC'}])
        .populate('a_customer')
        .exec(function(err, _payments) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(_payments));
          assert.strictEqual(_payments.length, 2);

          assert(_payments[0].a_customer);
          assert.equal(_payments[0].a_customer.id, customers[0].id);
          assert.equal(_payments[0].a_customer.name, 'foo');

          assert(_payments[1].a_customer);
          assert.equal(_payments[1].a_customer.id, customers[1].id);
          assert.equal(_payments[1].a_customer.name, 'bar');
          
          assert(_payments[0].a_customer.name);

          return done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.find()
        .exec(function(err, payments) {
          if (err) {
            return done(err);
          }

          assert(!_.isPlainObject(payments[0].a_customer));
          assert(!_.isPlainObject(payments[1].a_customer));

          return done();
        });
      });
    });
  });
});
