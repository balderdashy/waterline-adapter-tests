Vagrant Host Setup &amp; Config
===============================

Since it is not necessarily desirable to install all the databases on the local host where this package is 
tested a [Vagrant](https://www.vagrantup.com) configuration for a fully configured virtual host is provided. 
To run the tests using this virtual host follow these steps.

#### Step 1

Download and install:

  * [Virtual Box](https://www.virtualbox.org/wiki/Downloads) (if you do not have VMWare or Virtual Box installed)
  * [Vagrant](https://www.vagrantup.com/downloads.html)

**On Windows hosts:** Install the [Win-NFSD plugin](https://github.com/GM-Alex/vagrant-winnfsd) from 
the command line in your project folder to enable NFS support for Windows hosts which is much faster than the 
default Virtual Box file system drivers: 

`vagrant plugin install vagrant-winnfsd`

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


## Puppet Version Update

Puppet v3 is required for provisioning with the latest Puppet modules form Puppet-Forge. A shell provider
is used during Vagrant provisioning to:

  * Install [wget](https://www.gnu.org/software/wget/) if it's not installed already, and
  * Update Puppet using `apt-get`.


## Puppet Manifest

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
