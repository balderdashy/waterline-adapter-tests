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
            a_customer: customers[0].id
          }, {
            amount: 2,
            type: 'belongsTo find',
            a_customer: customers[1].id
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

      it('should return a customer when the populate criteria is added', function(done) {
        Associations.Payment.find({ type: 'belongsTo find', sort: 'amount ASC' })
        .populate('a_customer')
        .exec(function(err, _payments) {
          assert(!err, err);

          assert(Array.isArray(_payments));
          assert.strictEqual(_payments.length, 2, 'expected 2 payments, but got '+_payments.length+': '+require('util').inspect(_payments, false, null));

          assert(_payments[0].a_customer);
          assert.equal(_payments[0].a_customer.id, customers[0].id);
          assert(_payments[0].a_customer.name === 'foo',
          'Expected `payments[0].a_customer.name`==="foo", instead payments[0].customer ===> '+ require('util').inspect(_payments[0].a_customer, false, null));

          assert(_payments[1].a_customer);
          assert(_payments[1].a_customer.id === customers[1].id,
          'Expected `payments[1].a_customer.id` === '+customers[1].id+', instead payments[1].a_customer ===> '+ require('util').inspect(_payments[1].a_customer, false, null));
          assert(_payments[1].a_customer.name === 'bar',
          'Expected `payments[1].a_customer.name` === "bar", instead payments[1].a_customer ===> '+ require('util').inspect(_payments[1].a_customer, false, null)
          );

          assert(!_payments[0].toJSON().a_customer.name,
          'Expected payments[0] to have `a_customer` populated with a `name`, but instead it looks like: '+require('util').inspect(_payments[0], false, null)
          );

          done();
        });
      });

      it('should not return a customer object when the populate is not added', function(done) {
        Associations.Payment.find()
        .exec(function(err, payments) {
          assert.ifError(err);

          assert(!_.isPlainObject(payments[0].a_customer));
          assert(!_.isPlainObject(payments[1].a_customer));

          done();
        });
      });

      it('should call toJSON on associated record', function(done) {
        Associations.Payment.find()
        .populate('a_customer')
        .exec(function(err, payments) {
          assert.ifError(err);

          var obj = payments[0].toJSON();

          assert(!obj.type);
          assert(obj.a_customer);
          assert(obj.a_customer.createdAt);
          assert(!obj.a_customer.name);

          done();
        });
      });
    });

  });
});
