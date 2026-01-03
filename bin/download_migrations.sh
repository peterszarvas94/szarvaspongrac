#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb"
LOCAL_PATH="./pb"

rsync -avz --delete --progress "$SERVER:$REMOTE_PATH/pb_migrations/" "$LOCAL_PATH/pb_migrations/"
