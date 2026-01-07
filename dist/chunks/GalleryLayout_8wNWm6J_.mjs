import { createComponent, createAstro, renderComponent, renderTemplate, maybeRenderHead, addAttribute, renderScript } from './astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { createLucideIcon, $$Footer, $$BaseLayout } from './Footer_Ci-xaYyu.mjs';
import { $$ImageOff } from './ImageOff_CX4hz1c4.mjs';
import { $$PageTitle } from './PageTitle_YFyhDhd3.mjs';
import { $$ } from './.Layout_BhJMmowD.mjs';
import { $$X, $$EditButton } from './EditButton_UPD322sE.mjs';

var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", { value, configurable: true });
const $$Astro$7 = createAstro("https://szarvaspongrac.hu");
const $$ArrowLeft = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ArrowLeft;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "arrow-left", ...Astro2.props }, { "default": /* @__PURE__ */ __name$3(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="m12 19-7-7 7-7"></path>
	<path d="M19 12H5"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/ArrowLeft.astro", void 0);

var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", { value, configurable: true });
const $$Astro$6 = createAstro("https://szarvaspongrac.hu");
const $$ImagePlus = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ImagePlus;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "image-plus", ...Astro2.props }, { "default": /* @__PURE__ */ __name$2(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M16 5h6"></path>
	<path d="M19 2v6"></path>
	<path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"></path>
	<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
	<circle cx="9" cy="9" r="2"></circle>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/ImagePlus.astro", void 0);

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro$5 = createAstro("https://szarvaspongrac.hu");
const $$Upload = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Upload;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "upload", ...Astro2.props }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M12 3v12"></path>
	<path d="m17 8-5-5-5 5"></path>
	<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/Upload.astro", void 0);

const BookImage = createLucideIcon("book-image", [["path", { "d": "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17" }], ["path", { "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }], ["circle", { "cx": "10", "cy": "8", "r": "2" }]]);

const ChevronDown = createLucideIcon("chevron-down", [["path", { "d": "m6 9 6 6 6-6" }]]);

const ChevronUp = createLucideIcon("chevron-up", [["path", { "d": "m18 15-6-6-6 6" }]]);

const Trash = createLucideIcon("trash", [["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { "d": "M3 6h18" }], ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]]);

const $$Astro$4 = createAstro("https://szarvaspongrac.hu");
const $$ImageGallery = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ImageGallery;
  const { key } = Astro2.props;
  return renderTemplate`
${maybeRenderHead()}<div id="image-gallery"${addAttribute(key, "data-images")} class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
</div>

<template id="empty-gallery-template">
  <div id="empty-gallery" class="w-full flex flex-col gap-4 items-center justify-center">
    ${renderComponent($$result, "ImageOff", $$ImageOff, { "class": "size-10 text-base-content opacity-60" })}
    <p class="text-lg">Nincs kép feltöltve</p>
  </div>
</template>


<template id="image-gallery-item">
  <div data-id="id" data-sorting="0" data-cover="false" class="relative mb-4 block">
    <button commandfor="image-popover" command="show-popover" data-url="url" class="w-full block cursor-pointer border-0 bg-transparent p-0" type="button" aria-label="Kép megnyitása" title="Kép megnyitása">
      <img src="src" alt="alt"${addAttribute(200, "width")}${addAttribute(250, "height")} class="w-full block rounded-lg shadow-lg hover:shadow-xl" loading="lazy">
    </button>

    <div data-auth="true" data-edit="true" class="hidden absolute top-2 left-2 right-2 flex justify-between">
      <div class="join">
        <button data-cover="id" class="join-item btn btn-sm btn-square" title="Borítóképnek jelölés">
          ${renderComponent($$result, "BookImage", BookImage, { "class": "size-4" })}
        </button>
        <button data-delete="" class="join-item btn btn-sm btn-square" title="Törlés">
          ${renderComponent($$result, "Trash", Trash, { "class": "size-4" })}
        </button>
      </div>

      <div class="join">
        <button data-move-up="" class="join-item btn btn-sm btn-square" title="Mozgatás előre">
          ${renderComponent($$result, "ChevronUp", ChevronUp, { "class": "size-4" })}
        </button>
        <button data-move-down="" class="join-item btn btn-sm btn-square" title="Mozgatás hátra">
          ${renderComponent($$result, "ChevronDown", ChevronDown, { "class": "size-4" })}
        </button>
      </div>
    </div>
  </div>
</template>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ImageGallery.astro", void 0);

const $$Astro$3 = createAstro("https://szarvaspongrac.hu");
const $$ImageUpload = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ImageUpload;
  const { key } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<form data-edit="true" class="hidden max-w-xl mx-auto w-full"${addAttribute(key, "data-upload")}>
  <div data-auth="true" class="w-full flex gap-2 flex-wrap">
    <label for="file-upload" class="cursor-pointer w-full block" tabindex="0">
      <div class="flex flex-col gap-2 items-center justify-center h-40 border-2 border-dashed border-base-300 rounded-lg hover:border-base-content transition-colors bg-base-100 w-full">
        ${renderComponent($$result, "ImagePlus", $$ImagePlus, { "class": "w-10 h-10 text-base-content opacity-60" })}
        <span class="text-base-content font-medium">Képek kiválasztása</span>
      </div>
    </label>

    <div class="w-full flex flex-wrap justify-between gap-2">
      <ul data-files></ul>
      <button type="submit" class="btn mt-2">
        ${renderComponent($$result, "Upload", $$Upload, { "class": "size-4" })}
        Feltöltés
      </button>
    </div>

    <input id="file-upload" type="file" multiple class="hidden" accept="image/*" name="files">
  </div>
</form>

<template id="file-row">
  <li class="flex gap-2 item-center">
    <button class="btn btn-xs btn-square btn-ghost" type="button">
      ${renderComponent($$result, "X", $$X, { "class": "text-error size-4" })}
    </button>
    <span></span>
  </li>
</template>

${renderScript($$result, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ImageUpload.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ImageUpload.astro", void 0);

const $$ImagePopover = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`
${maybeRenderHead()}<div id="image-popover" popover class="w-screen h-screen bg-base-300/90 backdrop-blur-sm border-0 m-0 p-4 fixed inset-0">
  <div class="w-full h-full flex items-center justify-center relative">
    <button commandfor="image-popover" command="hide-popover" class="absolute top-4 right-4 bg-base-content/20 hover:bg-base-content/30 rounded-full p-2 z-10 cursor-pointer" aria-label="Kép bezárása (Esc)" title="Kép bezárása (Esc)" type="button">
      ${renderComponent($$result, "X", $$X, { "class": "w-6 h-6 text-base-100" })}
    </button>
    <img src="" alt="" class="w-auto max-w-full max-h-full object-contain">
  </div>
</div>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/ImagePopover.astro", void 0);

const $$Astro$2 = createAstro("https://szarvaspongrac.hu");
const $$CancelButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CancelButton;
  const { cancelText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button data-edit="true" data-edit-toggle class="btn">
  ${renderComponent($$result, "X", $$X, { "class": "size-4" })}
  ${cancelText ?? "M\xE9gsem"}
</button>`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/CancelButton.astro", void 0);

const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$GalleryFooter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GalleryFooter;
  const { backHref, backText } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="flex flex-wrap justify-center items-center py-4 px-4 sm:px-6 md:px-8">
  <a${addAttribute(backHref, "href")} class="btn btn-soft">
    ${renderComponent($$result, "ArrowLeft", $$ArrowLeft, { "class": "size-4" })}
    ${backText}
  </a>
</section>
${renderComponent($$result, "Footer", $$Footer, {})}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/components/GalleryFooter.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$GalleryLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GalleryLayout;
  const {
    title,
    description,
    pageTitle,
    key,
    backHref = "/kepzomuveszet",
    backText = "Vissza a K\xE9pz\u0151m\u0171v\xE9szethez"
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "mainClass": "py-4" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${renderComponent($$result2, "PageTitle", $$PageTitle, { "title": pageTitle })}

  
  ${maybeRenderHead()}<div class="flex flex-col items-center gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div data-auth="true" class="w-full flex justify-center gap-2">
      ${renderComponent($$result2, "EditButton", $$EditButton, {})}
      ${renderComponent($$result2, "CancelButton", $$CancelButton, { "cancelText": "Kil\xE9p\xE9s" })}
    </div>

    ${renderComponent($$result2, "ImageUpload", $$ImageUpload, { "key": key })}

    ${renderComponent($$result2, "ImagePopover", $$ImagePopover, {})}

    ${renderComponent($$result2, "ImageGallery", $$ImageGallery, { "key": key })}
  </div>

  
`, "default"), "footer": /* @__PURE__ */ __name(($$result2) => renderTemplate`${renderComponent($$result2, "GalleryFooter", $$GalleryFooter, { "slot": "footer", "backHref": backHref, "backText": backText })}`, "footer") })}

${renderScript($$result, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/GalleryLayout.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/GalleryLayout.astro", void 0);

export { $$GalleryLayout };
