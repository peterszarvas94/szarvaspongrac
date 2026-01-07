import { createAstro, createComponent, maybeRenderHead, renderComponent, addAttribute, renderTemplate, renderSlot } from '../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { createLucideIcon, $$Footer, $$BaseLayout, Mail, Phone } from '../chunks/Footer_Ci-xaYyu.mjs';
import { $$PageTitle } from '../chunks/PageTitle_YFyhDhd3.mjs';
export { renderers } from '../renderers.mjs';

const Code = createLucideIcon("code", [["path", { "d": "m16 18 6-6-6-6" }], ["path", { "d": "m8 6-6 6 6 6" }]]);

const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$ContactLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ContactLink;
  const { dataLink, title, icon: Icon } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col gap-2">
  <p class="text-xl font-bold text-base-content">
    ${title}
  </p>
  <div class="flex gap-2 items-center">
    ${renderComponent($$result, "Icon", Icon, { "class": "size-4 text-base-content/70" })}
    <a class="text-base-content/70 hover:link hover:text-base-content"${addAttribute(`link:${dataLink}`, "data-pb")}>
      <span>${dataLink}</span>
    </a>
  </div>
</div>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ContactLink.astro", void 0);

const $$ContactFooter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Developer Info Card -->${maybeRenderHead()}<section class="flex flex-wrap justify-center items-center py-4 px-4 sm:px-6 md:px-8 gap-2 text-base-content/60 text-sm">
  ${renderComponent($$result, "Code", Code, { "class": "size-4" })}
  <p>A weboldal fejlesztője:</p>
  <a href="https://peterszarvas.hu" target="_blank" rel="noopener noreferrer" class="hover:link hover:text-base-content">
    https://peterszarvas.hu
  </a>
</section>
${renderComponent($$result, "Footer", $$Footer, {})}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ContactFooter.astro", void 0);

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$ContactLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ContactLayout;
  const { title, description, pageTitle } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "mainClass": "py-4" }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`
  ${renderComponent($$result2, "PageTitle", $$PageTitle, { "title": pageTitle })}

  
  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ${renderSlot($$result2, $$slots["default"])}
  </div>

  
`, "default"), "footer": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`${renderComponent($$result2, "ContactFooter", $$ContactFooter, { "slot": "footer" })}`, "footer") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/ContactLayout.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Kapcsolat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ContactLayout", $$ContactLayout, { "title": "Kapcsolat - Szarvas Pongr\xE1c", "description": "Vegye fel a kapcsolatot Szarvas Pongr\xE1c grafikus, fest\u0151, illusztr\xE1tor m\u0171v\xE9sszel", "pageTitle": "Kapcsolat" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="card mx-auto w-96 bg-base-100 shadow-xl">
    <div class="card-body flex flex-col gap-6">
      ${renderComponent($$result2, "ContactLink", $$ContactLink, { "dataLink": "contact.email", "title": "Email", "icon": Mail })}
      ${renderComponent($$result2, "ContactLink", $$ContactLink, { "dataLink": "contact.phone", "title": "Telefon", "icon": Phone })}
    </div>
  </div>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kapcsolat.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kapcsolat.astro";
const $$url = "/kapcsolat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Kapcsolat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
