#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SERVER="peti@szarvaspongrac.hu"
REMOTE_PATH="/home/peti/projects/szarvaspongrac/pb/pb_data"
LOCAL_PATH="./pb/pb_data"
BACKUP_DIR="$ROOT/backups"

mkdir -p "$LOCAL_PATH" "$BACKUP_DIR"

if [[ -f "$LOCAL_PATH/data.db" ]]; then
  timestamp="$(date +%Y%m%d_%H%M%S)"
  cp "$LOCAL_PATH/data.db" "$BACKUP_DIR/data_before_prod_sync_${timestamp}.db"
  echo "Backed up local data.db to backups/data_before_prod_sync_${timestamp}.db"
fi

rsync -avz --progress \
  --exclude='_superusers/' \
  "$SERVER:$REMOTE_PATH/" "$LOCAL_PATH/"

echo "Synced prod pb_data to $LOCAL_PATH"
