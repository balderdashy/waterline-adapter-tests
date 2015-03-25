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

function echoTest {
	echo -e "\n\033[0;34m"
	echo -e "--------------------------------------------------------------------------------"
	echo -e "                                 $1"
	echo -e "--------------------------------------------------------------------------------"
	echo -e "\033[0m"
}

echoTest sails-postgresql
node test/integration/runner.js sails-postgresql
getStatus $?
POSTGR=$STATUS

echoTest sails-memory
node test/integration/runner.js sails-memory
getStatus $?
MEMORY=$STATUS

echoTest sails-disk
node test/integration/runner.js sails-disk
getStatus $?
DISKST=$STATUS

echoTest sails-mongo
node test/integration/runner.js sails-mongo
getStatus $?
MONGOD=$STATUS

echoTest sails-mysql
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
