#!/bin/bash
set -euo pipefail

SERVER="shared"
DOMAIN="szarvaspongrac.hu"
REMOTE_DIR="/home/peti/projects/szarvaspongrac"
WEB_DIR="/var/www/$DOMAIN"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

test -r .env.production || {
  echo "Missing .env.production; copy .env.production.example and configure it first." >&2
  exit 1
}
echo "Validating production config..."
APP_ENV=production mise exec -- go run ./cmd/server --check-config
mkdir -p tmp

echo "Building..."
# Generate sequentially so fingerprinted assets include the freshly built CSS/JS.
# Run templ directly to avoid cached task results missing new templates.
mise exec -- templ generate
mise run css
mise run bundle:tiptap
mise exec -- go run ./cmd/assets
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 mise exec -- go build -o tmp/server_linux_amd64 ./cmd/server

echo "Uploading app to $WEB_DIR..."
rsync -avz tmp/server_linux_amd64 "$SERVER:$WEB_DIR/server"
rsync -avz --delete static/ "$SERVER:$WEB_DIR/static/"
rsync -avz --delete public/ "$SERVER:$WEB_DIR/public/"
# Upload only production config over SSH; install atomically with mode 600.
ssh "$SERVER" "set -eu; umask 077; env_tmp=\$(mktemp '$WEB_DIR/.env.production.XXXXXX'); trap 'rm -f \"\$env_tmp\"' EXIT; cat > \"\$env_tmp\"; mv \"\$env_tmp\" '$WEB_DIR/.env.production'" < .env.production
ssh "$SERVER" "chmod +x '$WEB_DIR/server'"
# Existing installations may still reference .env; update the unit before restart.
scp deploy/systemd/szarvaspongrac.service "$SERVER:/tmp/szarvaspongrac.service"
ssh "$SERVER" "sudo -n install -m 0644 /tmp/szarvaspongrac.service /etc/systemd/system/szarvaspongrac.service && rm -f /tmp/szarvaspongrac.service && sudo -n systemctl daemon-reload"

echo "Uploading PocketBase..."
rsync -avz --delete --exclude 'pb_data' pb/ "$SERVER:$REMOTE_DIR/pb/"

echo "Restarting services..."
ssh -t "$SERVER" "sudo systemctl restart pocketbase && sudo systemctl restart szarvaspongrac"

echo "Done! https://$DOMAIN"
