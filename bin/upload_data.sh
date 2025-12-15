#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/bin"
MIGRATIONS_PATH="./pb_migrations"
DATA_PATH="./pb_data"

rsync -avz --delete --progess "$MIGRATIONS_PATH/" "$SERVER:$REMOTE_PATH/pb_migrations/"
rsync -avz --delete --progress "$DATA_PATH/" "$SERVER:$REMOTE_PATH/pb_data/"
