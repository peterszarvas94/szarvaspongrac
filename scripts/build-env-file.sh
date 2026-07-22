#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <app_env> <output_file>" >&2
  echo "  app_env: production" >&2
  echo "  output_file: path to write the env file" >&2
  exit 1
fi

APP_ENV_VALUE="$1"
OUTPUT_FILE="$2"

if ! command -v op >/dev/null 2>&1; then
  echo "Error: missing 1Password CLI ('op')." >&2
  exit 1
fi

if ! command -v varlock >/dev/null 2>&1 && ! npx --no-install varlock --version >/dev/null 2>&1; then
  echo "Error: missing varlock. Run 'npm install' in the repo." >&2
  exit 1
fi

case "$APP_ENV_VALUE" in
  production) OP_TOKEN_ITEM="production_token" ;;
  *) echo "Error: unknown env '$APP_ENV_VALUE' (expected: production)" >&2; exit 1 ;;
esac

echo "Fetching OP_TOKEN from 1Password..."
OP_TOKEN_VALUE="$(op read "op://szarvaspongrac/${OP_TOKEN_ITEM}/credential")"
if [ -z "$OP_TOKEN_VALUE" ]; then
  echo "Error: failed to read OP token for env '$APP_ENV_VALUE'" >&2
  exit 1
fi

echo "Resolving env vars via varlock..."
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OP_TOKEN="$OP_TOKEN_VALUE" APP_ENV="$APP_ENV_VALUE" npx varlock load --format env --compact > "$OUTPUT_FILE"

echo "Env file written to $OUTPUT_FILE"
