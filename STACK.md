# Stack Guideline

This document describes the tech stack and conventions used across my projects. Copy it into the root of a new project (or a project being refactored) and follow it as the source of truth for tooling, architecture, and patterns.

The philosophy: **a server-rendered Go monolith with hypermedia-driven interactivity**. One binary, one SQLite file, no client-side framework, no Node build step for the app itself. Simple to develop, simple to deploy, simple to operate.

---

## 1. Stack at a glance

| Concern           | Tool                                                                                         | Notes                                          |
| ----------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Language          | Go (latest stable)                                                                           | Single module, single binary                   |
| HTTP framework    | [Echo v4](https://echo.labstack.com/)                                                        | Routing, middleware, groups                    |
| Templating        | [templ](https://templ.guide/)                                                                | Type-safe HTML components compiled to Go       |
| Interactivity     | [Datastar](https://data-star.dev/) + SSE                                                     | Signals + server-sent HTML patches, no SPA     |
| Database          | SQLite via [`mattn/go-sqlite3`](https://github.com/mattn/go-sqlite3)                         | One file, WAL mode                             |
| ORM / migrations  | [Bun](https://bun.uptrace.dev/) + Bun SQL migrations                                         | Struct models, versioned `.up.sql`/`.down.sql` |
| Validation        | [`go-playground/validator`](https://github.com/go-playground/validator)                      | Struct-tag validation on input structs         |
| i18n              | [`invopop/ctxi18n`](https://github.com/invopop/ctxi18n)                                      | YAML locale files, context-based lookup        |
| Email             | [Resend](https://resend.com/) (`resend-go`)                                                  | Transactional email, magic-link auth           |
| Billing           | [Lemon Squeezy](https://www.lemonsqueezy.com/) (`lemonsqueezy-go`)                           | Subscriptions, webhooks                        |
| Env / secrets     | [varlock](https://varlock.dev/) + 1Password plugin                                           | `.env.schema` as the env contract              |
| Icons             | [Lucide](https://lucide.dev/) via [templucide](https://github.com/peterszarvas94/templucide) | Generated templ components, type-safe registry |
| Compression       | [`CAFxX/httpcompression`](https://github.com/CAFxX/httpcompression)                          | Brotli/gzip middleware                         |
| Rate limiting     | `golang.org/x/time/rate`                                                                     | Per-route limiter middleware                   |
| Toolchain / tasks | [mise](https://mise.jdx.dev/)                                                                | Pins tool versions, runs all tasks             |
| Hot reload        | [air](https://github.com/air-verse/air)                                                      | Rebuild + restart on change                    |
| Lint / verify     | golangci-lint, gopls, govulncheck                                                            | Wired into `mise run check`                    |
| VCS               | [Jujutsu (jj)](https://jj-vcs.github.io/) on top of Git                                      | Git is the backing store/remote only           |
| Reverse proxy     | Caddy                                                                                        | TLS termination on the server                  |
| Process manager   | systemd                                                                                      | `EnvironmentFile=` for env, one unit per env   |
| Logs              | slog → files → Vector → Better Stack                                                         | Structured logging shipped remotely            |
| Backups           | Cloudflare R2                                                                                | SQLite backup/restore scripts                  |
| Tunnels           | cloudflared                                                                                  | Expose localhost for webhook testing           |

**What is deliberately absent:** Node/npm for the app runtime, React/Vue/etc., Docker, Kubernetes, Postgres/MySQL, GraphQL, REST-JSON APIs for the UI. Add these only with a strong, written reason.

---

## 2. Project structure

```text
.
├── cmd/
│   ├── server/                # main.go, routes.go, static/ (CSS, JS, fonts)
│   ├── assets/                # asset fingerprinting generator
│   ├── dbmigrate/             # migration CLI (up/down/status/create)
│   └── seed/                  # local dev seed command
├── assets/                    # runtime asset-manifest lookup
├── db/
│   ├── models.go              # Bun table structs
│   ├── init.go                # connection, PRAGMAs, migrate/seed helpers
│   ├── bunmigrations/         # timestamped .up.sql / .down.sql pairs
│   └── seeds/                 # embedded dev seed SQL
├── data/<feature>/            # queries and CRUD per feature (no HTTP here)
├── handlers/<feature>/        # HTTP handlers per feature
├── views/<feature>/           # page data structs, signal maps, formatting
├── templates/<feature>/       # templ page/component templates
├── shared/                    # cross-feature templ components + icons/
├── middleware/                # auth, billing guards, CSRF, rate limit, etc.
├── utils/                     # env access, SSE hub, tab state, table query…
├── i18n/locales/<lang>/       # YAML translations
├── email/                     # email rendering and sending
├── billing/                   # subscription states, entitlements, webhooks
├── envgen/                    # generates typed env config from .env.schema
├── scripts/                   # local dev helpers (preflight, tunnel, versions)
├── deploy/
│   ├── scripts/               # deploy, setup, rollback, manage-db
│   └── server/                # everything installed on the server
├── docs/                      # contributor guides per topic
├── .env.schema                # varlock env contract (committed)
├── .air.toml                  # hot reload config
├── mise.toml                  # pinned tools + all tasks
└── go.mod
```

### Layering rules

| Layer    | Location               | Responsibility                                       |
| -------- | ---------------------- | ---------------------------------------------------- |
| Handler  | `handlers/<feature>/`  | HTTP only: parse input, orchestrate, render or patch |
| View     | `views/<feature>/`     | Page data structs, table specs, signal maps          |
| Template | `templates/<feature>/` | HTML via templ; reusable pieces in `shared/`         |
| Data     | `data/<feature>/`      | Bun queries and CRUD — never touches HTTP            |
| Model    | `db/models.go`         | Structs matching tables                              |

- Handlers stay thin. Query logic goes in `data/`, presentation logic in `views/`.
- `db/` owns schema, models, and the connection; `data/` owns feature queries. Handlers call `data/`, never the DB handle directly.
- Views read request context via helper accessors (e.g. a request scope), never `echo.Context` directly.
- Always scope queries by parent IDs (`group_id`, etc.) **inside the data function**, not just in the handler.

### Handler file convention per feature

| File                  | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `handlers_pages.go`   | GET pages (full renders)                                 |
| `handlers_actions.go` | POST/PATCH/DELETE mutations that persist data            |
| `handlers_state.go`   | `PATCH .../state` endpoints for UI-only Datastar updates |

---

## 3. HTTP layer (Echo)

- Register all routes in one place (`cmd/server/routes.go`); add a `--routes` flag to print the route table.
- Use Echo route groups to stack middleware:

```go
routes := e.Group(
    "/groups/:groupId/expenses",
    middleware.RequireAuth,
    middleware.RequireWithinSubscriptionLimit,
    middleware.RequireGroup,
)
routes.GET("", expense.IndexPage)
routes.PATCH("/state", expense.PatchIndexState)

admin := routes.Group("", middleware.RequireAdmin)
admin.POST("", expense.Create)
admin.DELETE("/:expenseId", expense.Delete)
```

- Standard middleware set (keep these in every project): request ID, request logger, error handler, security headers, compression, body limit, rate limit, CSRF, locale, auth/scope.
- **Request scope pattern**: auth middleware attaches a per-request struct (session user, route params, loaded entities like `Group`/`Event`) to context. Everything downstream reads it with one accessor (`utils.GetScope(ctx)`) instead of re-querying.
- Guards on mutation routes only — read routes stay accessible where policy allows (e.g. archived groups are read-only).

---

## 4. UI: templ + Datastar + SSE

No client-side framework. Pages are templ components; interactivity comes from Datastar attributes and server-sent events that patch the DOM.

### Rendering modes

- **Full page**: `utils.RenderPage(c, component)` on initial GET.
- **Fragment**: render one region's HTML and push it over SSE — used for everything after the initial load.

### SSE connection

Every app page opens one SSE stream on load:

```html
<div data-signals="{signalsJSON}" data-init="@get('/sse')"></div>
```

The SSE handler registers the tab's connection in a central hub (`utils.SSEHub`). Any handler can then push updates:

```go
utils.SSEHub.PatchHTML(c, html)      // replace a DOM region
utils.SSEHub.PatchSignals(c, sig)    // update client-side signals
```

Usually you need both after a state change so DOM and signals stay in sync.

### Signals

Client state is a JSON object exposed with `data-signals` on a root element; inputs bind with `data-bind`, events use `data-on`:

```html
<input data-bind="formData.title" />
<button
  data-on:click="@patch('/groups/123/expenses/state')({ action: 'save' })"
></button>
```

Handlers read them back into a struct:

```go
var signals struct {
    Action   string `json:"action"`
    FormData struct {
        Title string `json:"title"`
    } `json:"formData"`
}
datastar.ReadSignals(c.Request(), &signals)
```

**Hard rule:** JSON tags in the handler struct must match `data-bind` / `data-signals` keys in templates exactly. View packages expose `SignalsFromState` helpers to build the initial map so there is one source of truth.

### State PATCH convention

- `PATCH .../state` = UI-only changes (sort, filter, wizard step, dialog toggle). Typical flow: read signals → validate tab ID → load/update tab state → re-render fragment → `PatchHTML` + `PatchSignals` → return `204`.
- `POST` / `PATCH` / `DELETE` on the resource path = persisted mutations.
- Multiplex one state route with an `action` field in the signals rather than many tiny routes.

### Tab state (server-side per-browser-tab state)

Each browser tab gets a `tab_id` cookie. Server keeps an in-memory map keyed by tab ID for: wizard/form drafts, table sort/filter/pagination, dialog open/closed.

```go
tabID := utils.EnsureTabID(c)
state := utils.TabStateGetOrInit(tabID, defaultPageState)
// mutate state...
utils.TabStateSet(tabID, state)
```

It is per-process and lost on restart — **never store authoritative data there**.

### Tables

List pages share one `TableQuery` mechanism: parsed from query params, stored in tab state, with per-feature specs declaring allowed sort columns and filters in `views/<feature>/`. New sortable/filterable index pages reuse this instead of inventing their own.

### Dialogs, notifications, misc

- Dialogs are native `<dialog>` elements via shared components; open/closed lives in tab state.
- Toasts: `utils.Notify(c, message)` queues a message, drained on the next render.
- Shared UI (layouts, tables, form controls, empty states, badges, date/time pickers) lives in `shared/` as `component_*.templ` files — build new features from these first.

### CSS and JS

- Plain CSS in `static/css/` (`base.css`, `components.css`, `utilities.css`), plain ES modules in `static/js/`, vendored libs in `static/js/vendor/` with an `importmap.json`.
- Assets are fingerprinted at build time into `static/gen/` by a small Go generator; templates resolve URLs through a manifest, never hard-coded paths.
- JS tests (when needed) run with `node --test` — no bundler, no framework.

### Icons

Lucide icons as generated templ components with a type-safe registry, managed only through the templucide CLI:

```bash
templucide add "search,arrow-left"
templucide remove search
templucide sync
```

Use in templates as `@icons.Icon(icons.IconSearch, attrs)`. Never hand-edit the generated icon files.

---

## 5. Database: SQLite + Bun

### Connection

Open SQLite with these PRAGMAs (non-negotiable defaults):

```text
foreign_keys = ON
synchronous  = NORMAL
busy_timeout = 5000
cache_size   = 10000
```

DB path comes from env (`DB_PATH`): a local file in dev, `/opt/<app>/data/sqlite.db` on servers.

### Models and conventions

- One `db/models.go` with plain structs and Bun tags.
- **String IDs** (nanoid-style), not auto-increment integers.
- Optional fields use `sql.NullTime` / `sql.NullString`.
- Always write timestamps in UTC.

### Migrations

Timestamped `.up.sql` / `.down.sql` pairs in `db/bunmigrations/`, driven by a small CLI in `cmd/dbmigrate/`:

```bash
mise run db-create name=add_expenses_table
mise run db-up
mise run db-down
mise run db-status
```

- The server applies pending migrations **on every startup** — deploys never need a separate migration step.
- Write reversible down migrations when feasible; call out destructive changes in a comment.

### Seeds and tests

- Dev fixtures are embedded SQL under `db/seeds/`, applied by `mise run seed`.
- Tests needing a DB use in-memory SQLite or temp files through the same `db.Init`.

---

## 6. Environment and secrets: varlock + 1Password

`.env.schema` is committed and is the single env contract. It declares every variable with type, sensitivity, and per-environment values, including 1Password references for secrets:

```bash
# @type=enum(development,staging,production)
# @sensitive=false
APP_ENV=development

# @type=string
# @sensitive=false
DB_PATH=ifs(eq($APP_ENV, development), sqlite.db, /opt/myapp/data/sqlite.db)

# @sensitive
RESEND_API_KEY=ifs(eq($APP_ENV, production), op("op://Vault/production/app/RESEND_API_KEY"), )
```

Rules:

- Dev commands run through varlock: `varlock run -- air`, `varlock run -- go run ./cmd/seed`.
- A code generator (`envgen/`) produces a **typed Go config** from the schema — application code never calls `os.Getenv` for app config directly; it uses generated accessors.
- Servers get plain `.env.<env>` files written **at deploy time** from 1Password; systemd loads them with `EnvironmentFile=`. No secrets in the repo, ever.
- Adding an env var = edit `.env.schema`, run `mise run envgen`, use the typed accessor.

---

## 7. Auth, i18n, billing patterns

### Auth

- **Magic-link login** via email (Resend). No passwords.
- Sessions are DB rows; the cookie holds only the session token.
- `RequireAuth` redirects to `/login` with a `return_to` param; `OptionalAuth` for public pages that adapt to logged-in users; a superadmin middleware gates `/admin`.

### i18n

- YAML locale files under `i18n/locales/<lang>/`, nested keys (`expense.page_title`).
- Lookup with `ctxi18n.T(ctx, "key.path")` in both Go and templ.
- Locale resolution: logged-in user preference → `?lang=` override → cookie → `Accept-Language`.

### Billing (when the project has subscriptions)

- Provider: Lemon Squeezy. All access rules live in one `billing/` package — never scattered across handlers.
- Model access as **explicit states** (`trial_active`, `trial_expired`, `paid_active`, `subscription_cancelled`) with a small state-machine helper for transitions, and expose capabilities as flags (`CanCreateGroup`, `CanInviteUser`).
- Enforce via middleware guards (`RequireCanCreateGroup`, `RequireWithinSubscriptionLimit`, …) on mutating routes.
- Webhook endpoint verifies the provider signature and is idempotent (store processed event IDs). A background reconcile job on startup fixes drift.
- Local webhook testing uses a Cloudflare tunnel (`mise run tunnel`).

---

## 8. Tooling: mise as the single entry point

`mise.toml` pins every tool version (Go, air, templ, golangci-lint, varlock, cloudflared…) and defines every task. **Nobody runs raw commands; everything goes through `mise run <task>`.** Standard task names to keep across projects:

```bash
# Development
mise run dev            # preflight checks, then varlock + air hot reload
mise run seed           # seed local data
mise run routes         # print route table

# Database
mise run db-up | db-down | db-status
mise run db-create name=...

# Code generation
mise run generate       # envgen + templ + assets (run before commit)
mise run templ          # regenerate *_templ.go
mise run envgen         # regenerate typed env config
mise run assets         # fingerprint static assets

# Verification (run before every push)
mise run check          # format + vet + test + lint + lsp + version check
mise run govulncheck

# Deploy and ops
mise run deploy | rollback <env> | deploy:setup | manage-db
mise run tunnel | tunnel-setup
```

New machine setup is always: `mise trust && mise install && mise run dev`.

### Generated code — never edit by hand

| Generated                 | Source              | Command           |
| ------------------------- | ------------------- | ----------------- |
| `*_templ.go`              | `*.templ`           | `mise run templ`  |
| `utils/env_config_gen.go` | `.env.schema`       | `mise run envgen` |
| `static/gen/`             | static sources      | `mise run assets` |
| `shared/icons/`           | templucide registry | `templucide` CLI  |

---

## 9. Version control: Jujutsu (jj)

Git is only the backing store and remote protocol; day-to-day work uses jj:

```bash
jj status                          # working-copy changes
jj diff                            # review current change
jj describe -m "message"           # describe current change
jj new                             # start the next change
jj git fetch                       # fetch from remote
jj bookmark move master --to @     # advance trunk to current change
jj git push --bookmark master      # push
```

Trunk bookmark is `master`; `@` is the working copy. Run `mise run check` before pushing.

---

## 10. Deployment and operations

Deployment is a **local cross-compile + upload + symlink switch + systemd restart**. No CI/CD pipeline required, no containers.

### Server layout

```text
/opt/<app>/
├── current          → symlink to active release binary
├── previous         → symlink for instant rollback
├── releases/        → timestamped binaries (server-<timestamp>-<vcs-id>)
├── data/sqlite.db   → the database
├── env/.env.production, .env.staging
└── logs/
```

### Flow

1. `mise run deploy:setup` — once per server: installs mise, sqlite3, Caddy, systemd units, server scripts.
2. `mise run deploy` — builds the Linux binary (cross-compiles on macOS), fetches the env from 1Password and writes the release env file, uploads, swaps the `current` symlink, restarts services. Failed deploys auto-rollback to `previous`.
3. `mise run rollback <env>` — swap `current` ← `previous`, restart.

### Runtime

- Caddy terminates TLS and reverse-proxies to the app on a local port.
- systemd runs the app (one unit per env: `app` / `app-staging`), a Vector log-shipper unit, and a periodic healthcheck unit.
- App exposes `GET /health`.
- Structured logs (slog) go to files; Vector ships them to Better Stack when configured.
- SQLite backups go to Cloudflare R2 via `mise run manage-db` (backup/restore, local or remote).

Staging and production run **on the same host** as separate units/DBs/env files unless scale demands otherwise.

---

## 11. Adding a feature (checklist)

The canonical path for a new resource — keep this order:

1. **Migration**: `mise run db-create name=add_my_table`, edit `.up.sql`/`.down.sql`, add model to `db/models.go`, `mise run db-up`.
2. **Data layer**: `data/<feature>/` with `Get*/List*/Create*/Update*/Delete*` and table helpers; scope by parent IDs inside every query.
3. **View**: `views/<feature>/` — `model.go` (page data), `signals.go` (Datastar signal maps), `utils.go` (formatting).
4. **Templates**: `templates/<feature>/*.templ` reusing `shared/` components; `mise run templ`.
5. **Handlers**: `handlers_pages.go` / `handlers_actions.go` / `handlers_state.go`. Log as `slog.Info("<feature>.<handler>: ...", "err", err)`.
6. **Routes**: register in `cmd/server/routes.go` with the right middleware stack; guards only on mutations.
7. **i18n**: add keys to every locale YAML.
8. **Navigation**: update the sidebar/nav component if needed.
9. **Verify**: `mise run check` and `mise run routes`. Add tests for non-trivial behavior (billing rules, validation, state machines); use `httptest` for handler tests.

---

## 12. When to use this stack (and when not)

**Great fit:**

- SaaS apps, internal tools, dashboards, CRUD-heavy products
- Solo or small-team projects where operational simplicity matters
- Apps where server-rendered HTML with targeted updates covers the UX (forms, tables, wizards, dialogs — which is most apps)
- Single-region products where SQLite's single-writer model is fine

**Reconsider parts of it when:**

- You need heavy offline/client-side state (canvas editors, games) → a real frontend framework may be justified for that surface only
- Write concurrency or multi-region needs outgrow SQLite → Postgres, but keep the same layering (`db/` + `data/`)
- You need horizontal scaling of the app tier → the in-memory tab state and SSE hub must move to a shared store first
- A team is large enough that trunk-based jj workflow doesn't fit → plain Git branches work fine; nothing else changes

**Refactor guidance for existing projects:** adopt in this order — (1) mise + pinned tools + task names, (2) `.env.schema` + varlock + envgen, (3) the layer split (`handlers` / `views` / `data` / `db` / `templates`), (4) templ + Datastar for the UI, (5) the deploy scripts. Each step is independently valuable.
