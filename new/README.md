# Szarvas Pongrác (Go + templ + Datastar)

Experimental rewrite of the web layer. PocketBase is included locally under `pb/` for data and file storage.

## Prerequisites

- [mise](https://mise.jdx.dev/) — pins Go, templ, air, Node

## Setup

```bash
cd new
mise trust
mise install
cp .env.example .env
npm install
mise run generate
```

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

## Tasks

| Task | Description |
| ---- | ----------- |
| `mise run pb` | Start PocketBase |
| `mise run dev` | Hot reload Go server (air) |
| `mise run server` | Run Go server once |
| `mise run generate` | templ + Tailwind CSS |
| `mise run css` | Build CSS only |
| `mise run css:watch` | Watch CSS |
| `mise run build` | Build `tmp/server` binary |
| `mise run check` | fmt + vet + build |

## Admin

Log in at `/admin` with your PocketBase superuser credentials.
