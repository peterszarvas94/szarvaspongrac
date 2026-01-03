#!/bin/bash
set -e

SERVER="peti@shared"
DOMAIN="szarvaspongrac.hu"
REMOTE_DIR="/home/peti/projects/szarvaspongrac"

echo "Building..."
bun run build

echo "Uploading static files..."
rsync -avz --delete dist/ "$SERVER:/var/www/$DOMAIN/"

echo "Uploading PocketBase..."
rsync -avz --delete --exclude 'pb_data' pb/ "$SERVER:$REMOTE_DIR/pb/"

echo "Restarting PocketBase..."
ssh -t "$SERVER" "sudo systemctl restart pocketbase"

echo "Done! https://$DOMAIN"
