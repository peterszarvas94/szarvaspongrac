#!/bin/sh
set -eu
for database in data auxiliary; do
  file="/pb_data/$database.db"
  if [ ! -e "$file" ]; then
    litestream restore -config /etc/litestream.yml -if-replica-exists "$file"
  fi
  if [ -e "$file" ]; then
    test "$(sqlite3 "$file" 'PRAGMA quick_check;')" = ok
  fi
done
