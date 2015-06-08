### Commandline Tools ###

exec { 'aptGetUpdate':
  command => 'sudo apt-get update',
  path    => ['/bin', '/usr/bin']
}

package { 'git':
  ensure  => latest,
  require => Exec['aptGetUpdate']
}

package { 'vim':
  ensure  => present,
  require => Exec['aptGetUpdate']
}


### Node.js & npm ###

class { 'nodejs':
  version => 'latest',
}->
package{ 'npm':
  provider => 'npm',
  ensure   => 'latest',
}


### MongoDB ###

include apt

# $::lsbdistcodename should contain what you usually get with the `lsb_release -sc` command
$server_lsbdistcodename = downcase($::lsbdistcodename)

apt::source { 'mongodb-org-3.0':
  location    => 'http://repo.mongodb.org/apt/ubuntu',
  release     => "${server_lsbdistcodename}/mongodb-org/3.0",
  repos       => 'multiverse',
  key         => {
    'id'     => '7F0CEB10',
    'server' => 'keyserver.ubuntu.com',
  },
  include     => {
    'src' => false,
  },
}->
exec { 'mongodbListUpdate':
  command => 'sudo apt-get update',
  path    => ['/bin', '/usr/bin']
}->
class { 'mongodb::globals':
  manage_package_repo => false, # disable the 10gen repository
  server_package_name => 'mongodb-org',
  service_name        => 'mongod',
  version             => '3.0.3',
}->
class { '::mongodb::server': }


### MySQL ###

class { '::mysql::server':
  root_password    => '',
  databases        => {
    'sails_mysql'  => {
      ensure  => 'present',
      charset => 'utf8',
    },
  },
}


### PostgreSQL ###

#class {'postgresql::globals':
#  version => '9.3',
#  manage_package_repo => true,
#  encoding => 'UTF8',
#}->
#class { 'postgresql::server':
##  user => 'vagrant',
#  listen_addresses => '*',
#}->
#postgresql::server::role { 'vagrant':
#  superuser => true,
#}->
#postgresql::server::database{ 'sailspg':
#  owner => 'vagrant',
#}
#postgresql::server::database_grant { 'postgres_sailspg':
#  privilege => 'ALL',
#  db        => 'sailspg',
#  role      => 'postgres',
#}
#
#class { 'postgresql::server::contrib':
#  package_ensure => 'present',
#}


### Redis ###

include 'redis'
