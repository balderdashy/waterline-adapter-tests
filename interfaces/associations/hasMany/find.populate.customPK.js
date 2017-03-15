var assert = require('assert');
var util = require('util');
var _ = require('@sailshq/lodash');

describe('Association Interface', function() {
  describe('Has Many Association with Custom Primary Keys', function() {
    describe('.find', function() {
      before(function(done) {
        var apartmentRecords = [
          { number: 'a00-A', building: '1' },
          { number: 'b00-B', building: '1' }
        ];

        Associations.Apartment.createEach(apartmentRecords)
        .exec(function(err, apartments) {
          if (err) {
            return done(err);
          }

          Associations.Apartment.find({ building: '1' })
          .sort([{number: 'asc'}])
          .exec(function(err, apartments) {
            if (err) {
              return done(err);
            }

            // Create 8 payments, 4 from one apartment, 4 from another
            var payments = [];
            for(var i=0; i<8; i++) {
              if (i < 4) payments.push({ amount: i, apartment: apartments[0].number });
              if (i >= 4) payments.push({ amount: i, apartment: apartments[1].number });
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
        Associations.Apartment.find({ building: '1' })
        .populate('payments')
        .exec(function(err, apartments) {
          if (err) {
            return done(err);
          }

          assert(_.isArray(apartments));
          assert.strictEqual(apartments.length, 2);

          assert(_.isArray(apartments[0].payments));
          assert(_.isArray(apartments[1].payments));

          assert.strictEqual(apartments[0].payments.length, 4);
          assert.strictEqual(apartments[1].payments.length, 4);

          return done();
        });
      });
    });
  });
});
