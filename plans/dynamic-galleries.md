# Dynamic galleries

Make gallery names (and list) user-managed: add / rename / remove from the gallery index, instead of hardcoding routes and titles.

Scope: `new/` (Go + templ + Datastar) only.

## Current state

- Index cards and detail routes are hardcoded in `handlers/pages/pages.go` (`galleryRoutes` + card list).
- URLs: `/galeria`, `/galeria/:slug` (e.g. `olaj`).
- Images live in PocketBase `image` keyed by strings like `gallery.oil`.
- A `gallery` collection existed briefly then was deleted in migrations; nothing owns the gallery list today.
- Detail page already has image edit mode (upload, cover, reorder, delete).

## Data model

Recreate PocketBase collection `gallery`:

| Field | Notes |
| --- | --- |
| `slug` | URL segment; unique; required |
| `title` | Display name; required |
| `description` | Optional (SEO / meta); can defer |
| `sorting` | Index order |
| `key` | Stable image namespace, e.g. `gallery.oil`; **set once at create, never renamed** |

Migration must seed the six existing galleries so prod URLs and image keys keep working:

| slug | title | key |
| --- | --- | --- |
| olaj | Olajfestmények | gallery.oil |
| akvarell | Akvarellek | gallery.watercolor |
| pasztell | Pasztellek | gallery.pastel |
| grafika | Grafikák | gallery.graphics |
| illusztracio | Illusztrációk | gallery.illustration |
| egyeb | Egyéb alkotások | gallery.others |

New galleries: `key = "gallery." + slug` at create time. Later slug edits do **not** change `key`.

## Defaults

1. Create/edit forms both have **title** and **slug**.
2. Create: **+** on index opens form in place.
3. Edit: **✎** per gallery opens form in place.
4. `key` is immutable after create; slug may change (warn that old URL breaks).
5. Delete cascades: delete images by `key`, then gallery row (confirm dialog with count).
6. One open form at a time (create or a single edit).

## UI — gallery index (`/galeria`)

Authed only for admin controls. Public visitors still see the card grid.

### Layout

```
[PageTitle: Galéria]
[ + ]                            ← create toggle (authed)

[ create form in place ]         ← when create open

grid:
  [ ArtCard → /galeria/:slug ]
  [ ✎ ]                          ← outside the link / stopPropagation
  [ edit form in place ]         ← when this card is being edited
  ...
```

### Shared form (create + edit)

- Title (required)
- Slug (required, unique)
- Mentés / Mégse
- Edit only: Törlés → existing confirm dialog → cascade delete

### Interactions

| Control | Effect |
| --- | --- |
| **+** | Open create form; close any edit form |
| **✎** | Open that gallery’s edit form (prefill title/slug); close create + other edits |
| **Mégse** | Close form, no save |
| **Mentés** | Create or update → patch index (or navigate if needed) |

Suggested Datastar signal shape:

```text
$galleryForm = { mode: 'create' | 'edit' | null, id?: string, title: '', slug: '' }
```

### Card chrome

- Card remains a link to `/galeria/:slug`.
- Edit control must not navigate (outside `<a>`, or `evt.stopPropagation()`).
- Cover still comes from `image` with `cover=true` under that gallery’s `key`.

## Server

| Endpoint | Role |
| --- | --- |
| `GET /galeria` | List galleries from DB + covers |
| `GET /galeria/:slug` | Resolve slug from DB; 404 if missing |
| `POST /galleries` | Create (`title`, `slug`) → set `key`, sorting |
| `PATCH /galleries/:id` | Update title/slug |
| `DELETE /galleries/:id` | Confirm → delete images by key → delete gallery |

Drop hardcoded `galleryRoutes` and the static cards array in `handlers/pages/pages.go`.

## Out of scope (for this pass)

- Reorder galleries (↑↓) — add later if needed
- Metadata forms on the detail page `/galeria/:slug` — detail keeps image edit mode only
- Astro `src/` app — stays hardcoded until cutover
- Changing existing image keys

## Implementation order

1. PB migration: recreate `gallery` + seed six rows
2. `data/gallery` CRUD helpers
3. Wire `GalleryIndex` / `Gallery` handlers to DB
4. Index templ: +, per-card ✎, shared in-place form
5. Mutating endpoints + confirm delete + SSE/HTML patch of index
6. Slug uniqueness validation + basic slug format rules

## Open copy / UX notes

- On slug change in edit: short warning that the old URL will 404.
- Empty title/slug: block submit client- and server-side.
- After create: leave form closed; new card appears in grid (patch `#gallery-index` or equivalent).
