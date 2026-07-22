#!/bin/bash
# Install server config from this repo onto the host. Run on the server as peti (uses sudo).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DOMAIN="szarvaspongrac.hu"
WEB_DIR="/var/www/$DOMAIN"
NGINX_SITE="${DOMAIN}.conf"

mkdir -p /home/peti/pb /home/peti/szarvaspongrac "$WEB_DIR"

if [[ ! -f "$WEB_DIR/.env" ]]; then
  cp "$ROOT/env.production.example" "$WEB_DIR/.env"
  echo "Created $WEB_DIR/.env from example — set SESSION_SECRET before going live."
fi

sudo cp "$ROOT/systemd/pocketbase.service" /etc/systemd/system/pocketbase.service
sudo cp "$ROOT/systemd/szarvaspongrac.service" /etc/systemd/system/szarvaspongrac.service

# Only touches this site's vhost file (same basename as on the server).
sudo cp "$ROOT/nginx/$NGINX_SITE" "/etc/nginx/sites-available/$NGINX_SITE"
sudo ln -sfn "/etc/nginx/sites-available/$NGINX_SITE" "/etc/nginx/sites-enabled/$NGINX_SITE"
sudo nginx -t

sudo systemctl daemon-reload
sudo systemctl enable pocketbase szarvaspongrac
sudo systemctl restart pocketbase
sudo systemctl reload nginx

if [[ -x "$WEB_DIR/server" ]]; then
  sudo systemctl restart szarvaspongrac
  sudo systemctl status --no-pager pocketbase szarvaspongrac
else
  echo "No $WEB_DIR/server yet — run bin/deploy.sh, then: sudo systemctl start szarvaspongrac"
  sudo systemctl status --no-pager pocketbase
fi
