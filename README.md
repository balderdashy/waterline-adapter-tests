Waterline Adapter Tests
==========================
[![Build Status](https://travis-ci.org/balderdashy/waterline-adapter-tests.svg?branch=master)](https://travis-ci.org/balderdashy/waterline-adapter-tests)
[![npm version](https://badge.fury.io/js/waterline-adapter-tests.svg)](http://badge.fury.io/js/waterline-adapter-tests)
[![Dependency Status](https://david-dm.org/balderdashy/waterline-adapter-tests.svg)](https://david-dm.org/balderdashy/waterline-adapter-tests)

A set of integration tests that can be included in your Waterline Adapter module and used to test
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


## Vagrant and Puppet configuration

Since it is not necessarily desirable to install all the databases on the local host 
where this package is tested a [Vagrant](https://www.vagrantup.com) configuration for 
a fully configured virtual host is provided. To run the tests using this virtual host
follow these steps.

#### Step 1

Download and install:

  * [Virtual Box](https://www.virtualbox.org/wiki/Downloads) (if you do not have VMWare or Virtual Box installed)
  * [Vagrant](https://www.vagrantup.com/downloads.html)

**On Windows hosts:** Install the [Win-NFSD plugin](https://github.com/GM-Alex/vagrant-winnfsd) from 
the command line in your project folder to enable NFS support for Windows hosts which is much faster than the 
default Virtual Box file system drivers: `vagrant plugin install vagrant-winnfsd`

#### Step 2

The VM is configured using the [Puppet Server Management](https://puppetlabs.com) tool. It relies on puppet
modules which should be installed as git sub-modules, therefore, run:
 
 `$ git submodule init`
 `$ git submodule update`

#### Step 3

**On Windows hosts:** Note that `npm` doesn't play will with \*nix VMs running on a Windows host because
symlinks do not work properly. Therefore, you should run `npm install` now from the Windows terminal and 
not the virtual host.

Start up your VM with the following command which will download the VM image, boot it up and
configure the environment (install all dbs) the first time:

  `$ vagrant up`
  
Now SSH into the VM to run the tests:
  
  `$ vagrant ssh` (Note: If ssh.exe is not found on Windows add `C:\Program Files (x86)\Git\bin` to your path) 
  `$ cd /vagrant`
  `$ npm install` (If not done earlier)

#### Step 4
  
You are now in the mounted project folder within the VM and can run tests as usual:

  `$ npm test`
  
Once you're finished, be sure to shut down the VM from the host terminal:
  
  * `vagrant halt` - Shuts the VM down, ready to start up again with `vagrant up`.
  * `vagrant destroy` - Completely removes the VM from the system.


## MIT License

See LICENSE.md.
