#!/bin/bash
set -euo pipefail

SERVER="peti@szarvaspongrac.hu"
DOMAIN="szarvaspongrac.hu"
REMOTE_DIR="/home/peti/projects/szarvaspongrac"
WEB_DIR="/var/www/$DOMAIN"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Building env file from 1Password via varlock..."
mkdir -p tmp
./scripts/build-env-file.sh production tmp/production.env

echo "Building..."
mise run generate
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 mise exec -- go build -o tmp/server_linux_amd64 ./cmd/server

echo "Uploading app to $WEB_DIR..."
rsync -avz tmp/server_linux_amd64 "$SERVER:$WEB_DIR/server"
rsync -avz --delete static/ "$SERVER:$WEB_DIR/static/"
rsync -avz --delete public/ "$SERVER:$WEB_DIR/public/"
scp tmp/production.env "$SERVER:/tmp/szarvaspongrac.env"
rm -f tmp/production.env
ssh "$SERVER" "chmod +x '$WEB_DIR/server' && install -m 0600 /tmp/szarvaspongrac.env '$WEB_DIR/.env' && rm -f /tmp/szarvaspongrac.env"

echo "Uploading PocketBase..."
rsync -avz --delete --exclude 'pb_data' pb/ "$SERVER:$REMOTE_DIR/pb/"

echo "Restarting services..."
ssh -t "$SERVER" "sudo systemctl restart pocketbase && sudo systemctl restart szarvaspongrac"

echo "Done! https://$DOMAIN"
