#!/bin/bash

if [ "$1" == "test" ]; then
    USER="ec2-user"
    SERVER_ADDRESS="ec2-3-7-72-9.ap-south-1.compute.amazonaws.com"
    RSYNC_PRIVATE_KEY="-e ssh -i ~/keys/airtable-maps-test.pem"
    PRIVATE_KEY="~/keys/airtable-maps-test.pem"
else
    USER="root"
    SERVER_ADDRESS="5.161.52.123"
    RSYNC_PRIVATE_KEY="-e ssh -i ~/keys/hetzner"
    PRIVATE_KEY="~/keys/airtable-maps-test.pem"
fi

SOURCE_DIR="../airtable-maps"
EXCLUDE_FILE="--exclude node_modules --exclude .git --exclude images --exclude key"
DESTINATION_DIR="~/airtable-maps"

# transfer the files to the remote machine
rsync -avz $EXCLUDE_FILE "$RSYNC_PRIVATE_KEY" $SOURCE_DIR $USER@$SERVER_ADDRESS:$DESTINATION_DIR

