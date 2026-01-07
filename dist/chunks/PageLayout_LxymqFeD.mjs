import { createAstro, createComponent, renderComponent, renderTemplate, maybeRenderHead, renderSlot } from './astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$BaseLayout, $$Footer } from './Footer_Ci-xaYyu.mjs';
import { $$PageTitle } from './PageTitle_YFyhDhd3.mjs';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { title, description, pageTitle } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "mainClass": "py-4" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${renderComponent($$result2, "PageTitle", $$PageTitle, { "title": pageTitle })}

  
  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ${renderSlot($$result2, $$slots["default"])}
  </div>

  
`, "default"), "footer": /* @__PURE__ */ __name(($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "footer") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/PageLayout.astro", void 0);

export { $$PageLayout };
