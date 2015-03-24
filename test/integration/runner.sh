#!/bin/bash

function getStatus {
	if [ $1 -eq 0 ]
	then
		STATUS="\033[0;32msuccess\033[0m"
	else
		STATUS="\033[0;31mfailed \033[0m"
	fi
}

node test/integration/runner.js sails-postgresql
getStatus $?
POSTGR=$STATUS

node test/integration/runner.js sails-memory
getStatus $?
MEMORY=$STATUS

echo
echo    " -----------------------------------"
echo    "| adapter          | status         |"
echo    "|------------------|----------------|"
echo -e "| sails-postgresql | $POSTGR        |"
echo -e "| sails-memory     | $MEMORY        |"
echo    " -----------------------------------"


