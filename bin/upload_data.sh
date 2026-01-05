#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb"
LOCAL_PATH="./pb"

# Exclude superusers to prevent test accounts from being uploaded to prod
rsync -avz --delete --progress \
  --exclude='_superusers/' \
  "$LOCAL_PATH/pb_data/" "$SERVER:$REMOTE_PATH/pb_data/"
