Puppet Config for Vagrant Host
==============================

#### Puppet Version Update

Puppet v3 is required for provisioning with the latest Puppet modules form Puppet-Forge. A shell provider
is used during Vagrant provisioning to:

  * Install [wget](https://www.gnu.org/software/wget/) if it's not installed already, and
  * Update Puppet using `apt-get`.

#### Puppet Manifest

The Puppet Manifest will install:

  * [willdurand/nodejs](https://forge.puppetlabs.com/willdurand/nodejs) and `npm` - To run the tests as usual
  * [thomasvandoren/mongodb](https://forge.puppetlabs.com/thomasvandoren/mongodb)
  * [puppetlabs/mysql](https://forge.puppetlabs.com/puppetlabs/puppetlabs-mysql)
  * [puppetlabs/postgresql](https://forge.puppetlabs.com/puppetlabs/puppetlabs-postgresql)
  * [thomasvandoren/redis](https://forge.puppetlabs.com/thomasvandoren/redis)

Required dependencies:

  * [puppetlabs/stdlib](https://forge.puppetlabs.com/puppetlabs/puppetlabs-stdlib) - Required by `willdurand/nodejs`
  * [puppetlabs/wget](https://forge.puppetlabs.com/puppetlabs/puppetlabs-wget) - Required by `willdurand/nodejs`
  * [puppetlabs/apt](https://forge.puppetlabs.com/puppetlabs/puppetlabs-apt) - Used to setup a recent version of MongoDB
  * [puppetlabs/concat](https://forge.puppetlabs.com/puppetlabs/puppetlabs-concat) - Required by `puppetlabs/mysql`
  * [puppetlabs/gcc](https://forge.puppetlabs.com/puppetlabs/puppetlabs-gcc) - Required by `thomasvandoren/redis`
