#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/bin"
MIGRATIONS_PATH="./pb_migrations"
DATA_PATH="./pb_data"

rsync -avz --delete --progress "$SERVER:$REMOTE_PATH/pb_migrations/" "$MIGRATIONS_PATH/"
rsync -avz --delete --progress "$SERVER:$REMOTE_PATH/pb_data/" "$DATA_PATH/"
