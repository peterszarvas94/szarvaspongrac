# Agent Guidelines for Szarvaspongrac-astro

## Purpose

- Keep changes focused on what the user asked for
- Prefer minimal, readable edits over sweeping refactors
- Follow project conventions for Astro, Solid, Tailwind, and PocketBase

## Commands

- Always use `bun` over npm
- Never start the dev server or PocketBase unless explicitly asked

### Development

- `bun run dev` - Start development server (NEVER run this)
- `bun run build` - Build for production static output
- `bun run preview` - Preview built site

### Formatting

- `bun run format` - Format code with Prettier
- `bun run format:check` - Check formatting

### Testing and Linting

- No test runner or lint script is configured in `package.json`
- If asked to add tests or linting, confirm the tool choice first
- Single-test commands are not available until a test runner is added

### PocketBase (Database)

- `bun run pb:dev:mac` - Start PocketBase on macOS ARM
- `bun run pb:dev:linux` - Start PocketBase on Linux

## Agent Rules

- NEVER start, stop, or restart dev server or database
- ALWAYS plan tasks first using TodoWrite
- ALWAYS build for static files (`bun run build`) when asked to build
- Problem solving order: 1. HTML 2. CSS (TailwindCSS + DaisyUI) 3. TypeScript
- Only do what the user asked, no more, no less

## Tech Stack

- Framework: Astro 5.x with TypeScript (strict mode)
- Styling: TailwindCSS 4.x with DaisyUI
- Client islands: Solid.js (`.tsx` files)
- Database: PocketBase
- Rich text: TipTap editor
- Icons: `@lucide/astro` for Astro, `lucide-solid` for Solid.js
- Formatting: Prettier with Astro plugin

## Repository Layout

- `src/components/` - `.astro` and `.tsx` (Solid.js) components
- `src/layouts/` - Page layouts (`.astro`)
- `src/pages/` - Astro pages (no `v2` folder currently)
- `src/scripts/` - TypeScript utilities and client-side logic
- `src/styles/` - Global CSS (`global.css`, `tiptap.css`)
- `public/images/` - Static image assets
- `pb/` - PocketBase binary and migrations

## Path Aliases

- `@scripts/*` → `src/scripts/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@styles/*` → `src/styles/*`

## Formatting Rules

- Prettier is configured with `singleAttributePerLine: true`
- `.astro` files use the Astro Prettier parser
- Keep files ASCII when possible (avoid non-ASCII characters in code)

## TypeScript Guidelines

- Strict mode enabled, use explicit types and avoid `any`
- Interfaces use PascalCase (e.g., `Props`, `EditorProps`)
- Functions and variables use `camelCase`
- Components and classes use `PascalCase`
- Use `async/await`, optional chaining (`?.`), nullish coalescing (`??`)
- Export functions individually (Solid.js components use default export)

## Import Conventions

- Prefer path aliases (`@scripts/`, `@components/`, etc.)
- Group imports: external packages first, then internal modules
- Sort imports alphabetically within each group

## Error Handling

- Use `try/catch` for async operations that can fail
- Log with `console.error()` for unexpected failures
- Show user-friendly messages via `showAlert()` from `@scripts/toaster`

## Astro Components (`.astro`)

- Props interface must be named `Props`
- One attribute per line in markup
- Use TailwindCSS + DaisyUI classes exclusively
- Prefer semantic HTML before adding classes

## Solid.js Components (`.tsx`)

- Default export for the main component
- Use `createSignal` for state
- Use `onMount`/`onCleanup` for lifecycle management
- JSX import source is `solid-js` (configured in `tsconfig.json`)

## Styling Conventions

- Use Tailwind utility classes and DaisyUI component classes
- Avoid inline styles unless absolutely necessary
- Prefer existing design patterns in the current pages
- Use global styles in `src/styles/` only for truly global needs

## Custom Events

- Extend `TypedEvent<T>` from `@scripts/event`
- Provide a static `eventName` property
- Dispatch events with `window.dispatchEvent()`

## Icons

- Astro: `import { IconName } from "@lucide/astro";`
- Solid.js: `import { IconName } from "lucide-solid";`
- Use the `FileClock` icon for not implemented/coming soon pages

## PocketBase

- Client initialized in `@scripts/db`
- Collections: `content`, `image`, `link`
- Content caching via `@scripts/content-cache`
- Use `setCachedContent()` after saving to keep cache in sync

## Documentation and Rules Sources

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`
- No GitHub Copilot instructions found in `.github/copilot-instructions.md`
