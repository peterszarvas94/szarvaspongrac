import { createAstro, createComponent, renderComponent, renderTemplate, maybeRenderHead, addAttribute, renderSlot } from '../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { createLucideIcon, $$BaseLayout, $$Footer, Mail } from '../chunks/Footer_Ci-xaYyu.mjs';
export { renderers } from '../renderers.mjs';

const BookUser = createLucideIcon("book-user", [["path", { "d": "M15 13a3 3 0 1 0-6 0" }], ["path", { "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }], ["circle", { "cx": "12", "cy": "8", "r": "2" }]]);

const Palette = createLucideIcon("palette", [["path", { "d": "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" }], ["circle", { "cx": "13.5", "cy": "6.5", "r": ".5", "fill": "currentColor" }], ["circle", { "cx": "17.5", "cy": "10.5", "r": ".5", "fill": "currentColor" }], ["circle", { "cx": "6.5", "cy": "12.5", "r": ".5", "fill": "currentColor" }], ["circle", { "cx": "8.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }]]);

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$HomeLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HomeLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`
  
  ${maybeRenderHead()}<section class="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center before:absolute before:inset-0 before:bg-neutral/40 before:pointer-events-none"${addAttribute(`background-image: url("/images/szarvasok.jpg")`, "style")}>
    <!-- Hero Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 class="text-7xl text-base-100 mb-6">Szarvas Pongrác</h1>
      <p class="text-lg text-base-100/80 max-w-2xl mx-auto">
        Grafikus • Illusztrátor • Festő
      </p>
    </div>
  </section>

  
  <section class="py-8 bg-base-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      ${renderSlot($$result2, $$slots["default"])}
    </div>
  </section>

  
`, "default"), "footer": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "footer") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/HomeLayout.astro", void 0);

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$NavigationCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NavigationCard;
  const { href, title, icon: Icon, hoverColor } = Astro2.props;
  const colorClasses = {
    primary: "group-hover:bg-primary/20 group-hover:text-primary",
    secondary: "group-hover:bg-secondary/20 group-hover:text-secondary",
    accent: "group-hover:bg-accent/20 group-hover:text-accent"
  };
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="group w-full max-w-50">
  <div class="bg-base-100 w-full max-w-50 sm:max-w-full rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
    <div class="flex flex-col items-center text-center space-y-3">
      <div${addAttribute(`w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center transition-colors ${colorClasses[hoverColor]}`, "class")}>
        ${renderComponent($$result, "Icon", Icon, { "class": "w-6 h-6 text-base-content" })}
      </div>
      <h3 class="text-lg font-semibold text-base-content">${title}</h3>
    </div>
  </div>
</a>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/NavigationCard.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "HomeLayout", $$HomeLayout, { "title": "Szarvas Pongr\xE1c - Grafikus, Illusztr\xE1tor, Fest\u0151", "description": "Szarvas Pongr\xE1c grafikus, fest\u0151, illusztr\xE1tor honlapja" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="flex gap-4 flex-col sm:flex-row items-center justify-center">
    ${renderComponent($$result2, "NavigationCard", $$NavigationCard, { "href": "/eletrajz", "title": "\xC9letrajz", "icon": BookUser, "hoverColor": "primary" })}

    ${renderComponent($$result2, "NavigationCard", $$NavigationCard, { "href": "/kepzomuveszet", "title": "K\xE9pz\u0151m\u0171v\xE9szet", "icon": Palette, "hoverColor": "secondary" })}

    ${renderComponent($$result2, "NavigationCard", $$NavigationCard, { "href": "/kapcsolat", "title": "Kapcsolat", "icon": Mail, "hoverColor": "accent" })}
  </div>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/index.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
