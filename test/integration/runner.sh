#!/bin/bash

EXIT_CODE=0


function getStatus {
	if [ $1 -eq 0 ]
	then
		STATUS="\033[0;32msuccess\033[0m"
	else
		STATUS="\033[0;31mfailed \033[0m"
		EXIT_CODE=1
	fi
}

node test/integration/runner.js sails-postgresql
getStatus $?
POSTGR=$STATUS

node test/integration/runner.js sails-memory
getStatus $?
MEMORY=$STATUS

node test/integration/runner.js sails-disk
getStatus $?
DISKST=$STATUS

node test/integration/runner.js sails-mongo
getStatus $?
MONGOD=$STATUS

node test/integration/runner.js sails-mysql
getStatus $?
MYSQLD=$STATUS


echo
echo    " ---------------------------- "
echo    "| adapter          | status  |"
echo    "|------------------|---------|"
echo -e "| sails-postgresql | $POSTGR |"
echo -e "| sails-memory     | $MEMORY |"
echo -e "| sails-disk       | $DISKST |"
echo -e "| sails-mongo      | $MONGOD |"
echo -e "| sails-mysql      | $MYSQLD |"
echo    " ---------------------------- "


exit $EXIT_CODE
