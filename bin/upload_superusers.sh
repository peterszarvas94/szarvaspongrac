#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb"
LOCAL_PATH="./pb"

rsync -avz --delete --progress \
  "$LOCAL_PATH/pb_data/_superusers/" "$SERVER:$REMOTE_PATH/pb_data/_superusers/"
