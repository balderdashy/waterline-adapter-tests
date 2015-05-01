var util = require('util');
var assert = require('assert');
var _ = require('lodash');


describe('Association Interface', function() {

  describe('Has Many Association with Custom Primary Keys', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var apartmentRecords = [
        { number: 'a00-A', building: '1' },
        { number: 'b00-B', building: '1' }
      ];

      Associations.Apartment.createEach(apartmentRecords, function(err, apartments) {
        if(err) return done(err);

        Associations.Apartment.find({ building: '1' })
        .sort('number asc')
        .exec(function(err, apartments) {
          if(err) return done(err);

          // Create 8 payments, 4 from one apartment, 4 from another
          var payments = [];
          for(var i=0; i<8; i++) {
            if(i < 4) payments.push({ amount: i, apartment: apartments[0].number });
            if(i >= 4) payments.push({ amount: i, apartment: apartments[1].number });
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
        Associations.Apartment.find({ building: '1' })
        .populate('payments')
        .exec(function(err, apartments) {
          assert(!err, err);

          assert(Array.isArray(apartments));
          assert(apartments.length === 2, 'expected 2 apartments, got these apartments:'+require('util').inspect(apartments, false, null));

          assert(Array.isArray(apartments[0].payments));
          assert(Array.isArray(apartments[1].payments));

          assert(apartments[0].payments.length === 4);
          assert(apartments[1].payments.length === 4);

          done();
        });
      });

    });
  });
});
