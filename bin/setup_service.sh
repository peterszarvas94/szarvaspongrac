#!/bin/bash
# Push deploy/ configs to the server and run install.sh there.
set -euo pipefail

SERVER="peti@szarvaspongrac.hu"
REMOTE_DIR="/home/peti/projects/szarvaspongrac"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Uploading deploy configs..."
rsync -avz --delete "$ROOT/deploy/" "$SERVER:$REMOTE_DIR/deploy/"

echo "Installing on server..."
ssh -t "$SERVER" "bash '$REMOTE_DIR/deploy/install.sh'"

echo "Done."
