import { createAstro, createComponent, maybeRenderHead, renderTemplate } from './astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import 'clsx';

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$PageTitle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageTitle;
  const { title } = Astro2.props;
  return renderTemplate`<!-- Page Title Section -->${maybeRenderHead()}<h1 class="text-center text-4xl md:text-5xl font-bold pt-4 pb-10">
  ${title}
</h1>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/PageTitle.astro", void 0);

export { $$PageTitle };
