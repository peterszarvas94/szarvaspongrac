import { createComponent, renderComponent, renderTemplate } from '../../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$GalleryLayout } from '../../chunks/GalleryLayout_8wNWm6J_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Akvarell = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GalleryLayout", $$GalleryLayout, { "title": "Akvarellek - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c akvarelljeinek gy\u0171jtem\xE9nye", "pageTitle": "Akvarellek", "key": "gallery.watercolor" })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/akvarell.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/akvarell.astro";
const $$url = "/kepzomuveszet/akvarell";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Akvarell,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
