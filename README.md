Waterline Adapter Tests
==========================

A set of integration tests that can be included in you Waterline Adapter module and used to test
your adapter against the current Waterline API.

## Adapter Interface Specification

+ [Reference](https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md)
+ [Philosophy & Motivations](https://github.com/balderdashy/sails-docs/blob/master/contributing/intro-to-custom-adapters.md)


## Usage

#### Write a test runner

> i.e. `runner.js`

```javascript
/**
 * Test runner dependencies
 */
var mocha = require('mocha');
var TestRunner = require('waterline-adapter-tests');


/**
 * Integration Test Runner
 *
 * Uses the `waterline-adapter-tests` module to
 * run mocha tests against the specified interfaces
 * of the currently-implemented Waterline adapter API.
 */
new TestRunner({

	// Load the adapter module.
	adapter: require('./relative/path/to/your/adapter'),

	// Default adapter config to use.
	config: {
		schema: false
	},

	// The set of adapter interfaces to test against.
	interfaces: ['semantic', 'queryable']
});
```

#### Run the tests

```sh
$ node runner.js
```

## MIT License

See LICENSE.md.
