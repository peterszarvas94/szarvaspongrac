import { createComponent, renderComponent, renderTemplate } from '../../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$GalleryLayout } from '../../chunks/GalleryLayout_8wNWm6J_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Pasztell = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GalleryLayout", $$GalleryLayout, { "title": "Pasztellek - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c pasztell alkot\xE1sai", "pageTitle": "Pasztellek", "key": "gallery.pastel" })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/pasztell.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/pasztell.astro";
const $$url = "/kepzomuveszet/pasztell";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pasztell,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
