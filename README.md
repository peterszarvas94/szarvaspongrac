# Szarvas Pongrác (Go + templ + Datastar)

Web app. PocketBase is included locally under `pb/` for data and file storage.

## Prerequisites

- [mise](https://mise.jdx.dev/) — pins Go, templ, air, Node
- varlock + 1Password CLI — env contract / production secrets

## Setup

```bash
mise trust
mise install
npm install
mise run generate
```

Env comes from `.env.schema` via varlock (`mise run dev`). Deploy resolves production secrets from 1Password into `/var/www/szarvaspongrac.hu/.env`.

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

## Admin

Log in at `/admin` with your PocketBase superuser credentials.
