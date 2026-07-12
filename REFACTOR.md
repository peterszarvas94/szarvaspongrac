# Refactor Plan: Astro → Go + templ + Datastar (PocketBase stays)

Migration of szarvaspongrac.hu's web layer from static Astro 5 + Solid.js islands + client-side PocketBase calls to a server-rendered Go app: Echo + templ + Datastar + SSE, following `STACK.md` conventions.

**PocketBase is kept** as the database, auth provider, and file storage. What changes is who talks to it: today the browser calls PB directly with the JS SDK; after the refactor, only the Go server talks to PB, and the browser talks only to the Go server.

This is a plan only — no code changes yet.

---

## 1. What the site actually is (inventory)

A small, content-managed portfolio site in Hungarian, with one admin (the owner) editing content inline.

### Pages

| Route                  | Layout          | Dynamic content                                  |
| ---------------------- | --------------- | ------------------------------------------------ |
| `/`                    | HomeLayout      | hero image + intro content (`home.home`), nav cards |
| `/oneletrajz`          | ProseLayout     | rich text (`content` key)                        |
| `/elismeresek`         | ProseLayout     | rich text                                        |
| `/konyvillusztraciok`  | ProseLayout     | rich text                                        |
| `/kapcsolat`           | ContactLayout   | rich text + editable contact links (`link`)      |
| `/galeria`             | index           | 6 category cards with cover images               |
| `/galeria/{akvarell,egyeb,grafika,illusztracio,olaj,pasztell}` | GalleryLayout | image gallery per key (`gallery.*`) |
| `/admin`               | PageLayout      | login/logout                                     |

### PocketBase collections (unchanged)

- **content**: `key` (string), `value` (HTML string) — rich text blocks
- **image**: `key`, `file`, `cover` (bool), `sorting` (number) — gallery images + hero + inline editor images
- **link**: `key`, `url`, `text` — editable contact links
- **_superusers**: the admin login (PB built-in)

### Behaviors to preserve

- Public pages render content/images/links. Currently fetched client-side after page load; this becomes SSR — a strict improvement for SEO and first paint.
- Admin login with the PB superuser email + password.
- **Edit mode** toggle: when authenticated, an Edit button reveals per-block TipTap editors, image upload, and delete/reorder/set-cover controls.
- Rich text editing with TipTap: bold/italic/headings/lists/blockquote/text-align/images (inline image upload into content), save per content key.
- Gallery management: upload, delete (with confirm dialog), set cover, move up/down (swap `sorting`).
- Image lightbox/popover with prev/next + arrow-key navigation, download button.
- Toast notifications (Hungarian messages).
- Tailwind 4 + DaisyUI styling (kept — see decisions in §6).

### What can be dropped

- All client-side data fetching (`content-manager.ts`, `db.ts`, content cache, `parseDataAttr` plumbing) — replaced by SSR.
- Solid.js, Astro, Vite, and the Node build pipeline for the app (Node remains a dev-time tool for Tailwind and vendor bundling only).
- The PB JS SDK in the browser — the browser never talks to PB again.
- ~400 lines of hand-rolled DOM manipulation in `gallery.ts` — replaced by SSE fragment re-renders.

---

## 2. Target architecture

One Go binary in front of PocketBase:

```text
Browser ──> Caddy ──> Go app (Echo + templ + Datastar/SSE)
                          │
                          └──> PocketBase (localhost only: data, auth, files)
```

- The Go app is the only public surface. PB binds to localhost and is no longer exposed through Caddy (except optionally `/_/` for the PB dashboard, admin-gated).
- The Go server calls PB's REST API with a Go client (`pocketbase-go-sdk` or a thin hand-rolled client — see §6.1).
- Image files stay in PB storage. The Go app either proxies `/files/...` to PB's file endpoint (adding cache headers) or Caddy routes `/api/files/*` straight to PB. Proxying through Go is preferred: one public origin, and stored content HTML keeps working since URLs stay under our domain.

### What this keeps from STACK.md, and what it drops

| STACK.md item | Status | Reason |
| ------------- | ------ | ------ |
| Echo, templ, Datastar + SSE, layering, middleware set | Adopt | Core of the refactor |
| mise, air, varlock + `.env.schema` + envgen | Adopt | Tooling baseline |
| templucide icons, asset fingerprinting | Adopt | |
| SQLite + Bun + migrations + seed | **Drop** | PB owns the schema and data; PB migrations (`pb/pb_migrations/`) remain the migration mechanism |
| Sessions table + magic-link auth | **Drop** | PB superuser auth; the Go server holds the PB token (see §4) |
| Lemon Squeezy billing | Skip | No subscriptions |
| ctxi18n | Skip | Hungarian-only; strings live in templates |
| Tab state / TableQuery | Skip | No sortable tables or wizards |
| Plain CSS | **Deviate** | Keep Tailwind 4 + DaisyUI as a dev-time-only tool (decided) |
| Better Stack / Vector | Optional | slog to files first |
| Backups | R2 (decided) | `pb_data` (SQLite DBs + storage dir) backed up to Cloudflare R2 |

### Project structure (target)

```text
.
├── cmd/
│   ├── server/            # main.go, routes.go
│   └── assets/            # asset fingerprinting generator
├── assets/                # runtime asset-manifest lookup
├── pb/                    # PocketBase binary + pb_migrations + pb_data (unchanged)
├── pbclient/              # Go client for the PB REST API (auth, CRUD, files)
├── data/
│   ├── content/           # content block reads/writes via pbclient
│   ├── image/             # image records + file upload via pbclient
│   └── link/              # link reads/writes via pbclient
├── handlers/
│   ├── pages/             # public GET pages
│   ├── auth/              # login/logout (proxies PB auth)
│   ├── content/           # save content (edit mode)
│   ├── gallery/           # image upload/delete/cover/reorder
│   ├── files/             # PB file proxy with cache headers
│   └── sse/               # SSE hub endpoint
├── views/<feature>/       # page data structs, signal maps
├── templates/<feature>/   # *.templ
├── shared/                # layout, header, footer, dialog, toast, tiptap toolbar, icons/
├── middleware/            # auth, CSRF, security headers, compression, rate limit
├── utils/                 # env config, SSE hub, notify
├── static/
│   ├── css/               # Tailwind input + generated.css
│   └── js/                # main.js + vendor/ (datastar, tiptap bundle) + importmap
├── scripts/               # tiptap-bundle.js (dev-time vendor bundling)
├── deploy/
├── .env.schema            # APP_ENV, PORT, PB_URL, PB_ADMIN_* …
├── .air.toml
├── mise.toml
├── package.json           # dev-only: tailwind, daisyui, esbuild for vendor bundles
└── go.mod
```

The STACK.md layering holds, with `data/` calling `pbclient/` instead of Bun: handlers → views/templates for presentation, `data/<feature>/` for all PB access (handlers never call `pbclient` directly).

---

## 3. The rich text editor (the hard part)

Strategy: adopt the pattern from [peterszarvas94/datastar-tiptap](https://github.com/peterszarvas94/datastar-tiptap) — TipTap without any frontend framework, wired to Datastar signals.

### How it works (from the demo)

- TipTap (`@tiptap/core` + StarterKit + extensions) is **pre-bundled once** into a static ESM file `static/js/vendor/tiptap.js` via a dev-only npm script; Datastar is vendored the same way. An importmap in the layout maps the bare specifiers.
- `static/js/main.js` instantiates the editor and exposes it as `window.editor`; `onUpdate`/`onSelectionUpdate` dispatch a window `editorupdate` CustomEvent.
- The toolbar is server-rendered HTML: buttons use `data-on:click="editor.chain().focus().toggleBold().run()"`, active states are Datastar signals updated in one `data-on:editorupdate__window` expression (`$bold = editor.isActive('bold')` etc.), and the current HTML is mirrored into an `$editorHtml` signal.
- Save = `data-on:click="@patch('/content/...')"` — the server reads `$editorHtml` from the signals via `datastar.ReadSignals`.

### Adaptations needed for this site (beyond the demo)

1. **Multiple editable blocks per page** — the demo assumes a single `#editor` / global `window.editor`. Simplest robust approach: **only one editor active at a time** — entering edit mode on a block mounts TipTap on that block; saving/cancelling unmounts it. This matches actual usage (one admin editing one block). `main.js` exposes `initEditor(element, contentKey)` / `destroyEditor()` instead of auto-mounting.
2. **Edit-mode lifecycle**: edit mode becomes a Datastar signal (`$editMode`) set by the Edit button (rendered only when the server rendered the page for an authenticated admin). Mounting/unmounting TipTap on toggle is done from `main.js` listening to a custom event or a `data-on` hook.
3. **Extensions**: port the current extension set from `src/scripts/tiptap-setup.tsx` — StarterKit, Image, Placeholder, TextAlign, and the resizable-image extension(s). All go into the vendor bundle. The custom `tiptap-figure.ts` logic ports as-is (plain TS, no framework dependency).
4. **Inline image upload in the editor**: currently the browser uploads to PB directly then inserts the URL. New flow: hidden file input → `fetch` POST to the Go app (`/api/content-images`, multipart) → Go uploads to PB's `image` collection → JSON `{url}` (a `/files/...` URL on our origin) → `editor.chain().setImage({src}).run()`. Small plain-JS helper in `main.js`; doesn't need Datastar.
5. **Toolbar as a templ component**: `shared/component_tiptap_toolbar.templ` server-renders the toolbar with templucide icons, straight port of the demo's button markup.
6. **Save**: toolbar save button `@patch('/content/{key}')`; the Go handler reads `$editorHtml`, **sanitizes the HTML server-side** (e.g. `bluemonday` with a policy matching TipTap output — new and important, since content is stored and re-rendered as raw HTML), writes to PB, then pushes the freshly rendered read-view fragment over SSE and flips `$editMode` off.
7. **CSS**: port `src/styles/tiptap.css` + prose styling as-is.

### Risk assessment

Low-to-medium. The demo proves the core binding works. The real risks are (a) the mount/unmount lifecycle for multiple blocks and (b) the resizable-image extension behaving inside the vendored bundle — both get spiked first (Phase 2).

---

## 4. Auth: PocketBase login through the Go server

Kept as PB superuser email + password, but the token never reaches the browser:

1. `/admin` renders a login form (templ). Submit posts to the Go app.
2. The Go handler calls PB `POST /api/collections/_superusers/auth-with-password`.
3. On success, the Go app stores the PB token server-side keyed by a random session ID, and sets an HttpOnly, Secure, SameSite cookie with that session ID. (Simplest storage: in-memory map with expiry — acceptable for one admin; a restart just means logging in again. Alternative: encrypt the PB token itself into the cookie so sessions survive restarts — see §6.2.)
4. `RequireAuth` middleware resolves the cookie → PB token, attaches an authed `pbclient` to the request scope; handlers use it for mutations. Public reads use an unauthenticated (or service) client.
5. Token refresh via PB `auth-refresh` when near expiry; logout clears the cookie and the server-side entry.

This is strictly better than today (token currently lives in the browser via the JS SDK). All mutation routes get `RequireAuth` + CSRF; login gets a rate limiter.

Note: PB collection API rules can stay as they are, but since the browser no longer talks to PB, they can later be tightened to superuser-only across the board — defense in depth.

---

## 5. Migration phases

The new Go app is built in this repo alongside the old code (old `src/` stays until cutover). PB and its data are untouched throughout — **no data migration at all**. The site stays live on the old stack the whole time.

### Phase 0 — Scaffolding

- `mise.toml` with pinned Go, templ, air, golangci-lint, varlock, cloudflared, templucide; standard task names (`dev`, `check`, `generate`, `db-*` replaced by `pb:dev`, `deploy`).
- `go.mod`, `cmd/server` with Echo, `/health`, standard middleware set (request ID, logger, error handler, security headers, compression, body limit, rate limit, CSRF).
- `.env.schema` (`APP_ENV`, `PORT`, `PB_URL`, plus whatever the file proxy and session encryption need) + `envgen`.
- `.air.toml` (Go + templ + Tailwind watcher), asset fingerprinting generator, slog setup.
- `pbclient/` package: auth-with-password, auth-refresh, list/get/create/update/delete records with filters, multipart file upload, file URL building. Integration-test it against the local PB with dev data.

**Exit criteria**: `mise run dev` runs Go app + PB together with hot reload; `pbclient` round-trips against local PB; `mise run check` passes.

### Phase 1 — Public pages (read-only site)

- `data/content`, `data/image`, `data/link` packages on top of `pbclient`.
- Shared templ layouts porting `BaseLayout`/`Header`/`Footer`; templucide for the Lucide icons currently used; Tailwind + DaisyUI config ported (`static/css/input.css`, generated CSS fingerprinted).
- Port all pages from §1 as server-rendered templ pages. Content blocks render stored HTML via `templ.Raw` (sanitize on write going forward; run the sanitizer once over existing PB content as a safety pass).
- `/files/...` proxy handler to PB file storage with long cache headers. Existing stored content already points at PB file URLs (`/api/files/...`) — either proxy that exact path too, or normalize URLs in content on first save.
- Gallery pages: server-rendered grid sorted by `sorting`; lightbox with prev/next + keyboard nav as a small plain-JS module (port of the popover logic in `gallery.ts`).
- SEO parity: titles, meta descriptions, same URL structure.

**Exit criteria**: full public site renders identically (visually and URL-wise) from the Go binary against the real local `pb_data`. Deployable to staging.

### Phase 2 — Auth + editor spike

- Login/logout per §4; `RequireAuth` middleware + request scope with authed PB client.
- **Spike the TipTap integration in isolation** before wiring it into real pages: vendor bundle build (`scripts/tiptap-bundle.js` adapted from datastar-tiptap, including Image/TextAlign/Placeholder/resizable-image), one prose page with mount-on-edit → toolbar → save-to-PB → SSE fragment refresh. Validate the multiple-blocks and image-extension risks here.
- Server-side HTML sanitization policy (bluemonday) matching the TipTap schema; unit-test it against real production content.

**Exit criteria**: admin can log in and round-trip edit one content block end to end.

### Phase 3 — Full admin editing

- Edit mode signal + Edit/Cancel buttons on all editable pages (rendered only for the authenticated admin).
- Content editing on every prose/hero/contact block using the Phase 2 editor component.
- Link editing on the contact page (simple form via signals + `@patch`, no TipTap needed).
- Gallery admin: upload (multipart through Go to PB), delete with confirm dialog (`<dialog>` shared component), set cover, move up/down (swap `sorting`) — each mutation re-renders the gallery fragment and pushes it over SSE.
- Hero image upload on the home page.
- Toasts via the STACK.md `utils.Notify` pattern (Hungarian messages preserved).
- Guards: all mutations behind `RequireAuth` + CSRF; rate limit on login.

**Exit criteria**: feature parity with the current admin experience.

### Phase 4 — Deploy + cutover

- Deploy per STACK.md: cross-compile, `/opt/szarvaspongrac/{current,previous,releases,env,logs}` layout, systemd unit for the Go app alongside the existing `pocketbase` unit, healthcheck.
- Caddy: vhost switches from serving static `dist/` + PB proxy to reverse-proxying the Go app; PB stays localhost-only (optionally keep `/_/` dashboard reachable, admin-gated or via SSH tunnel).
- **R2 backups**: script + systemd timer backing up `pb_data` (use `sqlite3 .backup` or PB's backup API for the DBs, plus the `storage/` dir) to Cloudflare R2 via `rclone` or `aws s3` CLI; wire as `mise run manage-db` with backup/restore/list. Replaces the current `bin/download_data.sh`-style scripts.
- Cutover runbook:
  1. Deploy the Go app to the server on a side port against the **live** PB; smoke test (reads and an edit).
  2. Switch the Caddy vhost to the Go app. Old static `dist/` stays on disk for instant rollback (rollback = revert Caddyfile).
  3. Monitor; after a safe period, delete `src/`, Astro/Vite config, old `bin/` sync scripts, and the PB JS SDK dependency. Trim `package.json` down to dev-only tools (tailwind, daisyui, esbuild).
- Update `AGENTS.md` for the new stack; adopt the jj workflow per STACK.md §9.

**Exit criteria**: production serves from the Go binary; rollback path verified; R2 backups running; old frontend code removed.

---

## 6. Remaining open decisions (smaller now)

Decided already: keep PocketBase; keep Tailwind + DaisyUI; keep PB superuser login; backups to R2.

1. **PB Go client**: use the community `pocketbase-go-sdk` vs. a thin hand-rolled `pbclient` (~200 lines: auth, CRUD with filters, multipart upload). Recommendation: **hand-rolled** — the API surface used is tiny, no dependency risk, and it slots into the STACK.md layering cleanly.
2. **Session storage**: in-memory map (log in again after each deploy) vs. PB token encrypted into the cookie (survives restarts, no server state). Recommendation: **encrypted cookie** — deploys restart the app often per the STACK.md flow, and re-logging in every deploy would annoy the owner.
3. **File URL strategy**: proxy PB's existing `/api/files/...` paths as-is through the Go app (zero content rewriting, stored HTML keeps working) vs. a clean `/files/...` route with URL normalization on save. Recommendation: **proxy `/api/files/...` as-is** — no content migration, and normalize opportunistically on future saves if desired.

## 7. Effort estimate (rough)

| Phase | Size |
| ----- | ---- |
| 0 Scaffolding + pbclient | 1–2 days |
| 1 Public pages | 2–3 days |
| 2 Auth + editor spike | 2–3 days (the risk buffer lives here) |
| 3 Full admin | 2–3 days |
| 4 Deploy + cutover | 1–2 days |

Cheaper and safer than the previous plan: no schema design, no data importer, no cutover data freeze — PB keeps running untouched and the web layer swaps in front of it.
