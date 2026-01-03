#!/bin/bash
set -e

SERVER="peti@shared"
REMOTE_DIR="/home/peti/projects/szarvaspongrac"

ssh -t "$SERVER" "
mkdir -p /home/peti/pb
sudo tee /etc/systemd/system/pocketbase.service > /dev/null <<'EOF'
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=peti
Group=peti
WorkingDirectory=$REMOTE_DIR/pb
ExecStart=$REMOTE_DIR/pb/pocketbase_linux_amd64 serve --http=127.0.0.1:8090
Restart=always
RestartSec=5s
StandardOutput=append:/home/peti/pb/std.log
StandardError=append:/home/peti/pb/std.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now pocketbase
sudo systemctl status pocketbase
"
