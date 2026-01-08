#!/bin/bash
set -e

echo "WARNING: This script is deprecated and dangerous!"
echo "Use instead: backup_prod.sh -> restore_dev.sh <backup>"
echo ""
echo "This syncs entire databases and can cause data loss."
echo "Type 'deprecated' to continue anyway:"
read -r CONFIRM

if [ "$CONFIRM" != "deprecated" ]; then
    echo "Operation cancelled. Use backup/restore commands instead."
    exit 1
fi

SERVER="peti@shared"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb"
LOCAL_PATH="./pb"

echo "Syncing superusers data (from database) and files..."

# Sync the main database that contains superusers
rsync -avz --delete --progress \
  "$SERVER:$REMOTE_PATH/pb_data/data.db" "$LOCAL_PATH/pb_data/"

# Sync superusers directory if it exists (for profile images, etc.)
if ssh "$SERVER" "[ -d '$REMOTE_PATH/pb_data/_superusers' ]"; then
    echo "Syncing superusers files..."
    mkdir -p "$LOCAL_PATH/pb_data/_superusers"
    rsync -avz --delete --progress \
      "$SERVER:$REMOTE_PATH/pb_data/_superusers/" "$LOCAL_PATH/pb_data/_superusers/"
else
    echo "No superusers files directory on remote - syncing database only"
fi

echo "Superusers sync complete!"
