
Vagrant.configure(2) do |config|
  config.vm.box = "precise64"

  # Host name
  config.vm.hostname = "waterline.adapter.tests"

  # Network setup
  config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.network :forwarded_port, guest: 8080, host: 9090

  # A private dhcp network is required for NFS to work (on Windows hosts, at least)
  # We also use this IP to access the databases
  config.vm.network "private_network", ip: "10.55.66.77"

  # SSH password
  config.ssh.password = "vagrant"
  config.ssh.forward_agent = true

  # VM box setup (mem, cpus, etc.) when using VirualBox
  config.vm.provider :virtualbox do |v, override|
    override.vm.box_url = "http://files.vagrantup.com/precise64.box"
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--memory", 3072]
    v.customize ["modifyvm", :id, "--cpus", 1]

    #Enalbe symlinking in shared folders on Windows hosts.
    #NOTE: Windows, must launch CMD as Admin for this to work!
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate//vagrant", "1"]
  end

  # VM box setup (mem, cpus, etc.) when using VMWare
  config.vm.provider :vmware_workstation do |v, override|
    override.vm.box_url = "http://files.vagrantup.com/precise64_vmware.box"
    v.vmx["memsize"] = "3072"
    v.vmx["numvcpus"] = "1"
  end

  # Mount the project root as the vagrant folder
  config.vm.synced_folder ".", "/vagrant", nfs: true

  # An ugly fix to squish the "stdin: is not a tty" problem (https://github.com/mitchellh/vagrant/issues/1673)
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  # Ensure Puppet v3 is being used
  config.vm.provision :shell, :path => ".puppet/upgrade-puppet-v3.sh"

  # Configure guest environment using the Puppet manifest
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = ".puppet/manifests"
    puppet.module_path = ".puppet/modules"
    puppet.manifest_file = "waterline-adapter-tests.pp"
    puppet.hiera_config_path = ".puppet/hiera.yaml"
    puppet.options = ['--verbose']
  end
end
