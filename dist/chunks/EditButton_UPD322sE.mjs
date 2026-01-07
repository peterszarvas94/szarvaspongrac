import { createComponent, createAstro, renderComponent, renderTemplate, maybeRenderHead } from './astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$ } from './.Layout_BhJMmowD.mjs';

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro$2 = createAstro("https://szarvaspongrac.hu");
const $$Pencil = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Pencil;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "pencil", ...Astro2.props }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
	<path d="m15 5 4 4"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/Pencil.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$X = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$X;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "x", ...Astro2.props }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M18 6 6 18"></path>
	<path d="m6 6 12 12"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/X.astro", void 0);

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$EditButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$EditButton;
  const { editText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button data-edit-toggle data-edit="false" class="btn">
  ${renderComponent($$result, "Pencil", $$Pencil, { "class": "size-4" })}
  ${editText ?? "Szerkeszt\xE9s"}
</button>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/EditButton.astro", void 0);

export { $$EditButton, $$X };
