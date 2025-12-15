#!/bin/bash
set -e

mkdir -p /home/peti/pb
chown peti:peti /home/peti/pb

SERVICE_FILE=/etc/systemd/system/pocketbase.service

sudo tee $SERVICE_FILE > /dev/null <<'EOF'
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=peti
Group=peti
WorkingDirectory=/home/peti/projects/szarvaspongrac/bin
ExecStart=/home/peti/projects/szarvaspongrac/bin/pocketbase_linux_amd64 serve --http=127.0.0.1:8090
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
