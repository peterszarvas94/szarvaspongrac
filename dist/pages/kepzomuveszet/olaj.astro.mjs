import { createComponent, renderComponent, renderTemplate } from '../../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$GalleryLayout } from '../../chunks/GalleryLayout_8wNWm6J_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Olaj = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GalleryLayout", $$GalleryLayout, { "title": "Olajfestm\xE9nyek - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c olajfestm\xE9nyei", "pageTitle": "Olajfestm\xE9nyek", "key": "gallery.oil" })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/olaj.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/olaj.astro";
const $$url = "/kepzomuveszet/olaj";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Olaj,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
