#!/bin/bash
set -e

# Detect OS and use appropriate binary
if [[ "$OSTYPE" == "darwin"* ]]; then
  PB_BINARY="./pb/pocketbase_mac_arm64"
else
  PB_BINARY="./pb/pocketbase_linux_amd64"
fi

$PB_BINARY superuser delete test@test.com --dir=./pb/pb_data 2>/dev/null || echo "Test user does not exist"
