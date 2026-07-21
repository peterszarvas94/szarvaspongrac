#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OS="$(uname -s)"
ARCH="$(uname -m)"

if [[ "$OS" == "Darwin" && "$ARCH" == "arm64" ]]; then
  BIN="./pb/pocketbase_mac_arm64"
elif [[ "$OS" == "Linux" && "$ARCH" == "x86_64" ]]; then
  BIN="./pb/pocketbase_linux_amd64"
else
  echo "Unsupported platform: $OS $ARCH" >&2
  exit 1
fi

exec "$BIN" serve --dev --dir=./pb/pb_data --migrationsDir=./pb/pb_migrations
