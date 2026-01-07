import { createComponent, createAstro, maybeRenderHead, spreadAttributes, addAttribute, renderSlot, renderTemplate } from './astro/server_DVxX00a6.mjs';
import 'html-escaper';
import 'clsx';

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const size = Astro2.props.size;
  const cls = Astro2.props.class;
  const name = Astro2.props.iconName;
  delete Astro2.props.size;
  delete Astro2.props.class;
  delete Astro2.props.iconName;
  const props = Object.assign({
    "xmlns": "http://www.w3.org/2000/svg",
    "stroke-width": 2,
    "width": size ?? 24,
    "height": size ?? 24,
    "stroke": "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "fill": "none",
    "viewBox": "0 0 24 24"
  }, Astro2.props);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(["lucide", { [`lucide-${name}`]: name }, cls], "class:list")}>
	${renderSlot($$result, $$slots["default"])}
</svg>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/.Layout.astro", void 0);

export { $$ };
