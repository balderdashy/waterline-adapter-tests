var TestRunner = require('../');

describe('A new waterline-adapter-tests runner', function() {
  it ('should not crash', function(done) {

    new TestRunner({

      // Mocha opts
      mocha: {
        bail: true
      },

      // Load the adapter module.
      adapter: {
        identity: 'fakeAdapter',
        registerDatastore: function() {},
        teardown: function() {}
      },

      // Default connection config to use.
      config: {},

      interfaces: [],

      features: [],

    }, done);

  });
});