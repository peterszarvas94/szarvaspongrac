#!/usr/bin/env bash

set -euo pipefail

check_name="app server"
check_port="${PORT:-4321}"

if [ -f .env ]; then
  # shellcheck disable=SC1091
  set -a
  source .env
  set +a
  check_port="${PORT:-4321}"
fi

if ! command -v lsof >/dev/null 2>&1; then
  echo "dev preflight failed: lsof is required to check port ${check_port}" >&2
  exit 1
fi

port_pids() {
  lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null || true
}

ensure_port_free() {
  [ -z "$(port_pids "$1")" ]
}

signal_pids() {
  local signal="$1"
  shift
  local pid
  for pid in "$@"; do
    kill "-${signal}" "$pid" 2>/dev/null || true
  done
}

if ensure_port_free "$check_port"; then
  echo "dev preflight ok: port ${check_port} is free"
  exit 0
fi

pids=()
while IFS= read -r pid; do
  [ -n "$pid" ] && pids+=("$pid")
done <<< "$(port_pids "$check_port")"

if [ "${#pids[@]}" -eq 0 ]; then
  echo "dev preflight failed: ${check_name} port ${check_port} could not be freed (port is in use, but no process was found listening)" >&2
  exit 1
fi

signal_pids TERM "${pids[@]}"
sleep 0.3

if ensure_port_free "$check_port"; then
  echo "dev preflight: reclaimed ${check_name} port ${check_port} by stopping PID(s) ${pids[*]}"
  exit 0
fi

signal_pids KILL "${pids[@]}"
sleep 0.2

if ensure_port_free "$check_port"; then
  echo "dev preflight: force-reclaimed ${check_name} port ${check_port} by killing PID(s) ${pids[*]}"
  exit 0
fi

echo "dev preflight failed: ${check_name} port ${check_port} could not be freed" >&2
exit 1
