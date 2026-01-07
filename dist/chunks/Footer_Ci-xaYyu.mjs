import { createComponent, createAstro, maybeRenderHead, spreadAttributes, addAttribute, renderSlot, renderComponent, renderTemplate, renderHead, renderScript } from './astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import 'clsx';
/* empty css                             */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

const $$Astro$2 = createAstro("https://szarvaspongrac.hu");
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Icon;
  const {
    color = "currentColor",
    size = 24,
    "stroke-width": strokeWidth = 2,
    absoluteStrokeWidth = false,
    iconNode = [],
    class: className,
    ...rest
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes({
    ...defaultAttributes,
    width: size,
    height: size,
    stroke: color,
    "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
    ...rest
  })}${addAttribute(["lucide", className], "class:list")}>
  ${iconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)}
  ${renderSlot($$result, $$slots["default"])}
</svg>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/@lucide/astro/src/Icon.astro", void 0);

const createLucideIcon = (iconName, iconNode) => {
  const Component = createComponent(
    ($$result, $$props, $$slots) => {
      const { class: className, ...restProps } = $$props;
      return renderTemplate`${renderComponent(
        $$result,
        "Icon",
        $$Icon,
        {
          class: mergeClasses(
            Boolean(iconName) && `lucide-${toKebabCase(iconName)}`,
            Boolean(className) && className
          ),
          iconNode,
          ...restProps
        },
        { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` }
      )}`;
    },
    void 0,
    "none"
  );
  return Component;
};

const CircleCheck = createLucideIcon("circle-check", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m9 12 2 2 4-4" }]]);

const CircleX = createLucideIcon("circle-x", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m15 9-6 6" }], ["path", { "d": "m9 9 6 6" }]]);

const Copyright = createLucideIcon("copyright", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M14.83 14.83a4 4 0 1 1 0-5.66" }]]);

const Info = createLucideIcon("info", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 16v-4" }], ["path", { "d": "M12 8h.01" }]]);

const Mail = createLucideIcon("mail", [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }]]);

const Menu = createLucideIcon("menu", [["path", { "d": "M4 5h16" }], ["path", { "d": "M4 12h16" }], ["path", { "d": "M4 19h16" }]]);

const Phone = createLucideIcon("phone", [["path", { "d": "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" }]]);

const Settings = createLucideIcon("settings", [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]]);

const TriangleAlert = createLucideIcon("triangle-alert", [["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { "d": "M12 9v4" }], ["path", { "d": "M12 17h.01" }]]);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const menuItems = [
    { href: "/eletrajz", label: "\xC9letrajz" },
    { href: "/kepzomuveszet", label: "K\xE9pz\u0151m\u0171v\xE9szet" },
    { href: "/kapcsolat", label: "Kapcsolat" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-2 bg-base-100 shadow-sm border-b border-base-300 h-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="text-2xl font-bold hover:link" title="Kezdőlap" aria-label="Kezdőlap">
          Szarvas Pongrác
        </a>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex gap-8 py-2 text-sm font-medium text-base-content/70">
        ${menuItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="hover:link hover:text-base-content">
              ${item.label}
            </a>`)}
      </nav>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <input type="checkbox" id="mobile-menu-toggle" class="hidden peer">
        <label for="mobile-menu-toggle" class="btn btn-ghost btn-circle peer-checked:btn-active">
          ${renderComponent($$result, "Menu", Menu, { "class": "size-6" })}
        </label>
        <ul class="absolute top-16 right-4 menu menu-lg bg-base-100 rounded-box shadow-lg p-2 w-52 hidden peer-checked:block z-10">
          ${menuItems.map((item) => renderTemplate`<li>
                <a${addAttribute(item.href, "href")} class="px-4 py-2 hover:bg-base-200 rounded">
                  ${item.label}
                </a>
              </li>`)}
        </ul>
      </div>
    </div>
  </div>
</header>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/Header.astro", void 0);

const $$Toaster = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div data-toaster class="toast toast-end toast-bottom z-50">
</div>

<template id="toast-template">
  <div class="cursor-pointer alert shadow-lg">
    ${renderComponent($$result, "Info", Info, { "data-icon": "info", "class": "hidden" })}
    ${renderComponent($$result, "CircleCheck", CircleCheck, { "data-icon": "success", "class": "hidden" })}
    ${renderComponent($$result, "TriangleAlert", TriangleAlert, { "data-icon": "warning", "class": "hidden" })}
    ${renderComponent($$result, "CircleX", CircleX, { "data-icon": "error", "class": "hidden" })}
    <span></span>
  </div>
</template>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/Toaster.astro", void 0);

const $$ConfirmDialog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="confirm-dialog" popover class="p-0 rounded-lg shadow-xl border-0 backdrop:bg-neutral/50" data-astro-cid-u3kripq6>
  <div class="card bg-base-100 w-96" data-astro-cid-u3kripq6>
    <div class="card-body" data-astro-cid-u3kripq6>
      <h3 id="confirm-dialog-title" class="card-title text-lg" data-astro-cid-u3kripq6>
        Megerősítés
      </h3>
      <p id="confirm-dialog-message" class="py-4" data-astro-cid-u3kripq6>
        Biztosan folytatni szeretnéd?
      </p>
      <div class="card-actions justify-end gap-2" data-astro-cid-u3kripq6>
        <button id="confirm-dialog-cancel" class="btn btn-ghost" data-astro-cid-u3kripq6>
          Mégse
        </button>
        <button id="confirm-dialog-confirm" class="btn btn-primary" data-astro-cid-u3kripq6>
          Rendben
        </button>
      </div>
    </div>
  </div>
</div>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ConfirmDialog.astro", void 0);

const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Szarvas Pongrác - Grafikus, Festő, Illusztrátor",
    description = "Szarvas Pongrác grafikus, festő, illusztrátor honlapja - Modern verzió",
    mainClass = ""
  } = Astro2.props;
  return renderTemplate`<html lang="hu" data-theme="light" class="bg-base-200">
  <head>
    <meta charset="UTF-8">
    <meta name="description"${addAttribute(description, "content")}>
    <meta name="keywords" content="Szarvas Pongrác, grafikus, festő, illusztrátor, vadászat, természet, Baja">
    <meta name="author" content="Szarvas Pongrác">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <meta name="pb-url"${addAttribute("https://pb.szarvaspongrac.hu", "content")}>
    <title>${title}</title>
  ${renderHead()}</head>
  <body class="bg-base-200 min-h-screen relative font-inter">
    ${renderComponent($$result, "Header", $$Header, {})}
    <div class="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <main${addAttribute(`flex-1 ${mainClass}`, "class")}>
        ${renderSlot($$result, $$slots["default"])}
      </main>
      ${renderSlot($$result, $$slots["footer"])}
    </div>
    ${renderComponent($$result, "Toaster", $$Toaster, {})}
    ${renderComponent($$result, "ConfirmDialog", $$ConfirmDialog, {})}
  ${renderScript($$result, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$FooterLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FooterLink;
  const { dataLink, icon: Icon, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href ?? "", "href")} class="flex items-center hover:link hover:text-base-content text-sm transition-colors gap-1"${addAttribute(dataLink ? `link:${dataLink}` : void 0, "data-pb")}>
  ${renderComponent($$result, "Icon", Icon, { "class": "size-4" })}
  <span></span>
</a>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/FooterLink.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-base-300 border-t border-base-300 text-base-content/70 text-sm h-24 sm:h-20 md:h-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center md:flex-row md:justify-between gap-1 h-full">
    <div class="flex items-center justify-center gap-1 flex-wrap">
      ${renderComponent($$result, "Copyright", Copyright, { "class": "size-4" })}
      <span data-copyright-year>2025</span>
      <span>Szarvas Pongrác</span>
    </div>
    <div class="flex flex-col items-center gap-1 sm:gap-4 sm:flex-row">
      ${renderComponent($$result, "FooterLink", $$FooterLink, { "dataLink": "contact.email", "icon": Mail })}
      ${renderComponent($$result, "FooterLink", $$FooterLink, { "dataLink": "contact.phone", "icon": Phone })}
      ${renderComponent($$result, "FooterLink", $$FooterLink, { "href": "/admin", "icon": Settings })}
    </div>
  </div>
</footer>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/Footer.astro", void 0);

export { $$BaseLayout, $$Footer, Mail, Phone, createLucideIcon };
