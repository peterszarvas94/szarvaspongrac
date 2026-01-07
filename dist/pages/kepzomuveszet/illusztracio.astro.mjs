import { createComponent, renderComponent, renderTemplate } from '../../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$GalleryLayout } from '../../chunks/GalleryLayout_8wNWm6J_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Illusztracio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GalleryLayout", $$GalleryLayout, { "title": "Illusztr\xE1ci\xF3k - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c illusztr\xE1ci\xF3i", "pageTitle": "Illusztr\xE1ci\xF3k", "key": "gallery.illustration" })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/illusztracio.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/illusztracio.astro";
const $$url = "/kepzomuveszet/illusztracio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Illusztracio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
