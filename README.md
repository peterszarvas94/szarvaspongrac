# Szarvas Pongrác (Go + templ + Datastar)

Web app. PocketBase is included locally under `pb/` for data and file storage.

## Prerequisites

- [mise](https://mise.jdx.dev/) — pins Go, templ, air, Node

## Setup

```bash
mise trust
mise install
npm install
cp .env.development.example .env.development
mise run generate
```

Go loads `.env.development` by default, or `.env.production` when the shell sets `APP_ENV=production`, using godotenv. Configuration is parsed with caarlos0/env and validated at startup. Existing shell/systemd variables take precedence; `APP_ENV` inside the file must match the selected environment.

Both real files are ignored by Git. Development uses a fixed, development-only session secret if none is supplied.

For production, copy `.env.production.example` to `.env.production` and set a strong `SESSION_SECRET` of at least 32 characters. Changing the secret logs out existing admin sessions. `mise run deploy` validates and uploads only `.env.production` to `/var/www/szarvaspongrac.hu/.env.production` over SSH, atomically with mode 600, then updates the systemd unit and restarts. Never deploy the development file.

To validate without starting the server: `APP_ENV=production go run ./cmd/server --check-config`.

## Run

Two terminals:

```bash
# Terminal 1 — PocketBase
mise run pb

# Terminal 2 — Go app (hot reload)
mise run dev
```

Or without hot reload:

```bash
mise run server
```

Open http://localhost:4321

## Frontend build model

npm is **dev/build only**. The Go server serves static files; no Node at runtime.

| Dev (npm) | Build output (served by Go) |
| --------- | --------------------------- |
| Tailwind + DaisyUI + typography | `static/css/generated.css` |
| TipTap + extensions (esbuild) | `static/js/vendor/tiptap.js` |
| datastar (vendored as-is) | `static/js/vendor/datastar.js` |

App code (`static/js/main.js`, `notifications.js`) is hand-written ESM, loaded via import map in the layout.

After changing TipTap extensions or `scripts/tiptap-figure.js`:

```bash
mise run bundle:tiptap
```

After changing `static/css/input.css` or Tailwind/DaisyUI config:

```bash
mise run css
```

## Tasks

| Task | Description |
| ---- | ----------- |
| `mise run deps` | `npm install` |
| `mise run pb` | Start PocketBase |
| `mise run dev` | Hot reload Go server (air) |
| `mise run server` | Run Go server once |
| `mise run generate` | templ + CSS + TipTap bundle |
| `mise run css` | Build CSS only |
| `mise run css:watch` | Watch CSS |
| `mise run bundle:tiptap` | Rebuild TipTap vendor bundle |
| `mise run build` | Build `tmp/server` binary |
| `mise run check` | fmt + vet + build |
| `mise run setup-service` | Install systemd + nginx on the VPS |
| `mise run deploy` | Build, upload, and restart app on the VPS |

## Admin

Log in at `/admin` with your PocketBase superuser credentials.
