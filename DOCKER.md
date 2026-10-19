# Docker deployment

Build the Go application and PocketBase from the repository root:

```sh
docker build -t szarvaspongrac .
docker build -f pb/Dockerfile -t szarvaspongrac-pocketbase .
```

The app builds templ, Tailwind, Tiptap and fingerprinted assets from source.
It runs as UID/GID 10001 on port 4321. Required runtime variables are
`APP_ENV=production`, `PUBLIC_URL`, `SESSION_SECRET` (at least 32 characters),
and `PB_URL` pointing to the separate PocketBase container on port 8090.
Secrets and local database files are excluded from the build context.

For standalone Docker Compose, supply `PUBLIC_URL` and `SESSION_SECRET` through
your secret manager or shell environment, then run:

```sh
docker compose up -d --build
```

Compose binds the app and PocketBase to localhost ports 4321 and 8090. Put
an HTTPS reverse proxy in front of the app. Expose PocketBase's HTTP API and
admin UI through a separate HTTPS domain only when needed. PocketBase stays
reachable internally as `http://pocketbase:8090`.

For two separate Coolify applications, use repository-root build contexts:
`/Dockerfile` with port 4321 for the app, and `/pb/Dockerfile` with port 8090
for PocketBase. Set `PB_URL` to the PocketBase container's internal hostname.
Mount persistent storage at `/pb/pb_data`. The image contains the committed
migrations. PocketBase 0.34.0 downloads are checksum-verified for amd64/arm64.

## Moving existing data

The image and Compose volume start with an empty database. To copy an existing
site, use PocketBase's backup feature or SQLite online backup for both database
files, plus the matching `storage/` tree. Stop only the destination instance
while restoring into its `/pb/pb_data` volume. Restored files must be writable
by UID/GID 10001. Back up the source before a production cutover, verify the
restored content, login and images, then change DNS. The Dockerfiles alone do
not transfer production data. Keep the persistent volume when replacing the
container; `docker compose down -v` would remove it.

## Shared server in Coolify

The shared server uses `/compose.coolify.yaml`. It binds the app to loopback
24321 and PocketBase to loopback 28090 behind the existing host Caddy. The
Coolify runtime variables `PUBLIC_URL` and `SESSION_SECRET` preserve the existing
production settings. Persistent
PocketBase data is bind-mounted from `/data/shared/szarvaspongrac/pb_data`.
This path must contain the verified migrated data before the first production
cutover; an empty path would create an empty PocketBase instance. Keep it and
all backups when replacing containers. The old systemd deployment remains
available for controlled recovery; do not run both production stacks.

Deployments are managed by central Coolify on Shared. Pushes to the configured
production branch deploy automatically through the Forgejo bridge. Host Caddy
provides HTTPS; application listeners are bound to loopback.
