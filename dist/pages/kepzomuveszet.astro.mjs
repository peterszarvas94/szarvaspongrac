import { createAstro, createComponent, maybeRenderHead, addAttribute, renderComponent, renderScript, renderTemplate } from '../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$PageLayout } from '../chunks/PageLayout_LxymqFeD.mjs';
import { $$ImageOff } from '../chunks/ImageOff_CX4hz1c4.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$ArtCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ArtCard;
  const { href, coverKey, imageAlt, title, className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="w-full">
  <div class="hover-3d w-full">
    <figure${addAttribute(`max-w-100 rounded-2xl overflow-hidden shadow-lg shadow-base-content/50 ${className}`, "class")}>
      <img src=""${addAttribute(imageAlt, "alt")} class="w-full h-64 object-cover opacity-0 transition-opacity duration-300"${addAttribute(coverKey, "data-cover")}>
      <div class="p-6 text-center bg-neutral text-neutral-content">
        <h3 class="text-xl font-semibold">${title}</h3>
      </div>
    </figure>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</a>

<template id="missing-cover">
  <div class="h-64 w-full flex items-center justify-center">
    ${renderComponent($$result, "ImageOff", $$ImageOff, { "class": "size-10 text-base-content opacity-60" })}
  </div>
</template>

${renderScript($$result, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ArtCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ArtCard.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Kepzomuveszet = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "title": "K\xE9pz\u0151m\u0171v\xE9szet - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c k\xE9pz\u0151m\u0171v\xE9szeti alkot\xE1sai", "pageTitle": "K\xE9pz\u0151m\u0171v\xE9szet" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="grid place-items-center w-fit mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    ${renderComponent($$result2, "ArtCard", $$ArtCard, { "href": "/kepzomuveszet/olaj", "coverKey": "gallery.oil", "imageAlt": "Olajfestm\xE9nyek", "title": "Olajfestm\xE9nyek" })}

    ${renderComponent($$result2, "ArtCard", $$ArtCard, { "href": "/kepzomuveszet/akvarell", "coverKey": "gallery.watercolor", "imageAlt": "Akvarellek", "title": "Akvarellek" })}

    ${renderComponent($$result2, "ArtCard", $$ArtCard, { "href": "/kepzomuveszet/pasztell", "coverKey": "gallery.pastel", "imageAlt": "Pasztellek", "title": "Pasztellek" })}

    ${renderComponent($$result2, "ArtCard", $$ArtCard, { "href": "/kepzomuveszet/grafika", "coverKey": "gallery.graphics", "imageAlt": "Grafik\xE1k", "title": "Grafik\xE1k" })}

    ${renderComponent($$result2, "ArtCard", $$ArtCard, { "href": "/kepzomuveszet/illusztracio", "coverKey": "gallery.illustration", "imageAlt": "Illusztr\xE1ci\xF3k", "title": "Illusztr\xE1ci\xF3k" })}
  </div>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet.astro";
const $$url = "/kepzomuveszet";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Kepzomuveszet,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
