import { createComponent, renderComponent, renderTemplate } from '../../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$GalleryLayout } from '../../chunks/GalleryLayout_8wNWm6J_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Grafika = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GalleryLayout", $$GalleryLayout, { "title": "Grafik\xE1k - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c grafikai munk\xE1i", "pageTitle": "Grafik\xE1k", "key": "gallery.graphics" })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/grafika.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/grafika.astro";
const $$url = "/kepzomuveszet/grafika";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Grafika,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
