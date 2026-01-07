import { createComponent, createAstro, renderComponent, renderTemplate, maybeRenderHead, addAttribute, renderScript, renderSlot } from '../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$BaseLayout, $$Footer } from '../chunks/Footer_Ci-xaYyu.mjs';
import { $$PageTitle } from '../chunks/PageTitle_YFyhDhd3.mjs';
import { $$X, $$EditButton } from '../chunks/EditButton_UPD322sE.mjs';
import { $$ } from '../chunks/.Layout_BhJMmowD.mjs';
export { renderers } from '../renderers.mjs';

var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", { value, configurable: true });
const $$Astro$2 = createAstro("https://szarvaspongrac.hu");
const $$Save = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Save;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "save", ...Astro2.props }, { "default": /* @__PURE__ */ __name$2(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
	<path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
	<path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/Save.astro", void 0);

const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$CancelSaveButtons = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CancelSaveButtons;
  const { contentKey, cancelText, saveText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="join" data-edit="true">
  <button data-edit-toggle class="join-item btn">
    ${renderComponent($$result, "X", $$X, { "class": "size-4" })}
    ${cancelText ?? "M\xE9gsem"}
  </button>
  <button${addAttribute(`content:${contentKey}`, "data-save")} class="join-item btn btn-primary">
    ${renderComponent($$result, "Save", $$Save, { "class": "size-4" })}
    ${saveText ?? "Ment\xE9s"}
  </button>
</div>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/CancelSaveButtons.astro", void 0);

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$ProseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProseLayout;
  const { key, title, description, pageTitle } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "mainClass": "py-4" }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`${pageTitle && renderTemplate`${renderComponent($$result2, "PageTitle", $$PageTitle, { "title": pageTitle })}`}${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div data-auth="true" class="w-full p-4 flex justify-center gap-2">
      ${renderComponent($$result2, "EditButton", $$EditButton, {})}
      ${renderComponent($$result2, "CancelSaveButtons", $$CancelSaveButtons, { "contentKey": key })}
    </div>
    
    ${renderComponent($$result2, "Editor", null, { "contentKey": key, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "@components/Editor", "client:component-export": "default" })}

    <!-- Prose Content -->
    <article data-edit="false" class="prose max-w-none">
      ${renderSlot($$result2, $$slots["default"])}
    </article>

    <div data-auth="true" class="w-full p-4 flex justify-center gap-2">
      ${renderComponent($$result2, "EditButton", $$EditButton, {})}
      ${renderComponent($$result2, "CancelSaveButtons", $$CancelSaveButtons, { "contentKey": key })}
    </div>
  </div>

  
`, "default"), "footer": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "footer") })}

${renderScript($$result, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/ProseLayout.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/ProseLayout.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Eletrajz = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ProseLayout", $$ProseLayout, { "key": "cv.cv", "title": "\xC9letrajz - Szarvas Pongr\xE1c", "description": "Szarvas Pongr\xE1c \xE9letrajza \xE9s m\u0171v\xE9szeti p\xE1lyafut\xE1sa", "pageTitle": "\xC9letrajz" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  
  ${maybeRenderHead()}<div data-pb="content:cv.cv">&nbsp;</div>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/eletrajz.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/eletrajz.astro";
const $$url = "/eletrajz";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Eletrajz,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
