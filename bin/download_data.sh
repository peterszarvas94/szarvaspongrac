#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb"
LOCAL_PATH="./pb"

# Exclude superusers to preserve local test accounts
rsync -avz --delete --progress \
  --exclude='_superusers/' \
  "$SERVER:$REMOTE_PATH/pb_data/" "$LOCAL_PATH/pb_data/"
