# Migration and Backup Guide

## Migrating Dev Data to Prod

To migrate dev data to prod:

1. Stop both dev and prod PocketBase servers.
2. Copy the contents of `pb_data_dev/` to `pb_data/` (create if missing).
3. Start the prod server.

## Backing Up Dev Data

To backup dev data:

1. Stop the dev server.
2. Copy `pb_data_dev/` to a safe backup location (e.g., external drive or cloud).
3. Restart the dev server.

## Copying Schema Changes from Dev to Prod

To copy schema changes from dev to prod in PocketBase:

1. Copy any new migration files from `pb_migrations/` (dev) to the prod server's `pb_migrations/` directory.
2. On the prod server, run `./pocketbase migrate` to apply the schema changes.
3. Restart the prod server if needed.
