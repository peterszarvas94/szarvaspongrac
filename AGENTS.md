# Agent Guidelines for Szarvaspongrac-astro

## Commands

Always use `bun` over npm.

### Development

- `bun run dev` - Start development server (NEVER run this)
- `bun run build` - Build for production
- `bun run preview` - Preview built site

### Formatting

- `bun run format` - Format code with Prettier
- `bun run format:check` - Check formatting

### PocketBase (Database)

- `bun run pb:dev:mac` - Start PocketBase on macOS ARM
- `bun run pb:dev:linux` - Start PocketBase on Linux

## Agent Rules

- NEVER start, stop, or restart dev server or database
- ALWAYS plan tasks first using TodoWrite
- ALWAYS build for static files (`bun run build`)
- Problem solving order: 1. HTML 2. CSS (TailwindCSS + DaisyUI) 3. TypeScript
- Only do what the user asked, no more, no less

## Tech Stack

- **Framework**: Astro 5.x with TypeScript (strict mode)
- **Styling**: TailwindCSS 4.x with DaisyUI
- **Client Islands**: Solid.js (`.tsx` files)
- **Database**: PocketBase
- **Rich Text**: TipTap editor
- **Icons**: `@lucide/astro` for Astro, `lucide-solid` for Solid.js
- **Formatting**: Prettier with Astro plugin

## File Structure

- `src/components/` - `.astro` and `.tsx` (Solid.js) components
- `src/layouts/` - Page layouts (`.astro`)
- `src/pages/v2/` - Pages (only work on v2 directory)
- `src/scripts/` - TypeScript utilities and client-side logic
- `src/styles/` - Global CSS (`global.css`, `tiptap.css`)
- `public/images/` - Static image assets
- `pb/` - PocketBase binary and migrations

## Path Aliases

- `@scripts/*` → `src/scripts/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@styles/*` → `src/styles/*`

## Code Style

### TypeScript

- Strict mode enabled, use explicit types, avoid `any`
- Interfaces use PascalCase (e.g., `Props`, `EditorProps`)
- Use `async/await`, optional chaining (`?.`), nullish coalescing (`??`)
- Export functions individually (except Solid.js components use default export)

### Imports

- Use path aliases (`@scripts/`, `@components/`, etc.)
- Group: external packages first, then internal modules, sorted alphabetically

### Error Handling

- Use try/catch for async operations, log with `console.error()`
- Show user-friendly messages via `showAlert()` from `@scripts/toaster`

### Astro Components (.astro)

- Props interface named `Props`
- Single attribute per line (configured in `.prettierrc`)
- Use TailwindCSS + DaisyUI classes exclusively, no custom Hungarian CSS

### Solid.js Components (.tsx)

- Default export for main component
- Use `createSignal` for state, `onMount`/`onCleanup` for lifecycle
- JSX import source is `solid-js`

### Custom Events

- Extend `TypedEvent<T>` from `@scripts/event`
- Use static `eventName` property, dispatch via `window.dispatchEvent()`

## Icons

- Astro: `import { IconName } from "@lucide/astro";`
- Solid.js: `import { IconName } from "lucide-solid";`
- Use `FileClock` icon for not implemented/coming soon pages

## Database (PocketBase)

- Client initialized in `@scripts/db`
- Collections: `content`, `image`, `link`
- Content caching via `@scripts/content-cache`
- Use `setCachedContent()` after saving to keep cache in sync
