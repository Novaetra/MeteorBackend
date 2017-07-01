#!/bin/bash
set -e

if [ -z "$1" ]
  then
    echo "No deploy host provided."
    exit 1
fi

### Configuration ###

SERVER=$1
APP_DIR=/var/www/lenny
KEYFILE=
REMOTE_SCRIPT_PATH=/tmp/deploy-backend.sh

### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}


### Automation steps ###

if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

SCRIPTPATH=$(dirname "$0")

METEOR_VERSION=`meteor --version`

if [[ $METEOR_VERSION =~ "Meteor 1.4."* ]] || [[ $METEOR_VERSION =~ "Meteor 1.5."* ]]; then
  run meteor build --server-only $SCRIPTPATH/output
  mv $SCRIPTPATH/output/*.tar.gz $SCRIPTPATH/package.tar.gz
  rmdir $SCRIPTPATH/output
else
  run meteor bundle $SCRIPTPATH/package.tar.gz
fi
run scp $KEYARG $SCRIPTPATH/package.tar.gz $SERVER:$APP_DIR/
run scp $KEYARG $SCRIPTPATH/work.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH
echo "Cleaning up..."
rm $SCRIPTPATH/package.tar.gz
