# Agent Guidelines for Szarvaspongrac-astro

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview built site
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

## Tech Stack

- Astro 5.x with TypeScript (strict mode)
- TailwindCSS 4.x with DaisyUI
- Prettier with Astro plugin

## Code Style

- TypeScript interfaces use PascalCase (e.g., `Props`)
- Use `---` frontmatter for imports and logic
- Prefer single attribute per line in Astro components
- CSS: Use nested selectors and CSS-in-JS in `<style>` blocks
- Images go in `/public/images/` directory
- NEVER work on v1 pages - only work on `/src/pages/v2/` directory
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
- ALWAYS build for static files (`npm run build`)
- Problem solving order: 1. HTML 2. CSS (TailwindCSS + DaisyUI) 3. TypeScript
- only do what the user asked, no more, no less

No test framework configured - this is a portfolio/gallery site.
