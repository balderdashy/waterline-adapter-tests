var _ = require('lodash'),
    assert = require('assert');

describe('Association Interface', function() {

  describe('Belongs To Association', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    var customers, payments;

    before(function(done) {
      Associations.Customer.createEach([{
          name: 'foo'
        }, {
          name: 'bar'
        }], function(err, _customers) {
        if(err) return done(err);

        // Expose results for examination below
        customers = _customers;

        Associations.Payment.createEach([{
            amount: 1,
            type: 'belongsTo find',
            customer: customers[0].id
          }, {
            amount: 2,
            type: 'belongsTo find',
            customer: customers[1].id
          }], function(err, _payments) {
          if(err) return done(err);

          // Expose results for examination below
          payments = _payments;
          done();
        });
      });
    });

    describe('.find()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should return customer when the populate criteria is added', function(done) {
        Associations.Payment.find({ type: 'belongsTo find' })
        .populate('customer')
        .exec(function(err, _payments) {
          assert(!err, err);

          assert(Array.isArray(_payments));
          assert(_payments.length === 2, 'expected 2 payments, but got '+_payments.length+': '+require('util').inspect(_payments, false, null));

          assert(_payments[0].customer);
          assert(_payments[0].customer.id === customers[0].id);
          assert(_payments[0].customer.name === 'foo',
          'Expected `payments[0].customer.name`==="foo", instead payments[0].customer ===> '+ require('util').inspect(_payments[0].customer, false, null));

          assert(_payments[1].customer);
          assert(_payments[1].customer.id === customers[1].id,
          'Expected `payments[1].customer.id` === '+customers[1].id+', instead payments[1].customer ===> '+ require('util').inspect(_payments[1].customer, false, null));
          assert(_payments[1].customer.name === 'bar',
          'Expected `payments[1].customer.name` === "bar", instead payments[1].customer ===> '+ require('util').inspect(_payments[1].customer, false, null)
          );

          assert(!_payments[0].toJSON().customer.name,
          'Expected payments[0] to have `customer` populated with a `name`, but instead it looks like: '+require('util').inspect(_payments[0], false, null)
          );

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.find()
        .exec(function(err, payments) {
          assert(!err);

          assert(!_.isPlainObject(payments[0].customer));
          assert(!_.isPlainObject(payments[1].customer));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Associations.Payment.find()
        .populate('customer')
        .exec(function(err, payments) {
          assert(!err);

          var obj = payments[0].toJSON();

          assert(!obj.type);
          assert(obj.customer);
          assert(obj.customer.createdAt);
          assert(!obj.customer.name);

          done();
        });
      });
    });

  });
});
