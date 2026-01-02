# Agent Guidelines for Szarvaspongrac-astro

## Commands

Always use bun over npm.

- `bun run dev` - Start development server -> never run it
- `bun run build` - Build for production
- `bun run preview` - Preview built site
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check formatting

Never start or stop server or database.

## Tech Stack

- Astro 5.x with TypeScript (strict mode)
- TailwindCSS 4.x with DaisyUI
- Prettier with Astro plugin
- For client islands use Solid.js

## Code Style

- TypeScript interfaces use PascalCase (e.g., `Props`)
- Use `---` frontmatter for imports and logic
- Prefer single attribute per line in Astro components
- CSS: Use nested selectors and CSS-in-JS in `<style>` blocks
- Images go in `/public/images/` directory
- Use TailwindCSS + DaisyUI classes, no custom Hungarian CSS classes

## Icons

- Uses `@lucide/astro` package for icons
- Import icons in frontmatter: `import { IconName } from "@lucide/astro";`
- Use `file-clock` icon for not implemented/coming soon pages

## File Structure

- Components: `src/components/*.astro`
- Layouts: `src/layouts/*.astro`
- Pages: `src/pages/v2/*.astro` (only work on v2)
- Global styles: `src/styles/global.css`
- Public assets: `public/` (no bundling)

## Agent Rules

- NEVER stop or restart dev server
- NEVER run tests (no test framework configured)
- ALWAYS plan tasks first using TodoWrite
- ALWAYS build for static files (`bun run build`)
- Problem solving order: 1. HTML 2. CSS (TailwindCSS + DaisyUI) 3. TypeScript
- only do what the user asked, no more, no less

No test framework configured - this is a portfolio/gallery site.
