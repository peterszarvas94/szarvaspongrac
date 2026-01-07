import { createComponent, createAstro, renderComponent, renderTemplate, maybeRenderHead } from '../chunks/astro/server_DVxX00a6.mjs';
import 'piccolore';
import 'html-escaper';
import { $$PageLayout } from '../chunks/PageLayout_LxymqFeD.mjs';
import { $$ } from '../chunks/.Layout_BhJMmowD.mjs';
export { renderers } from '../renderers.mjs';

var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", { value, configurable: true });
const $$Astro$3 = createAstro("https://szarvaspongrac.hu");
const $$Lock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Lock;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "lock", ...Astro2.props }, { "default": /* @__PURE__ */ __name$4(($$result2) => renderTemplate`
	${maybeRenderHead()}<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
	<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/Lock.astro", void 0);

var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", { value, configurable: true });
const $$Astro$2 = createAstro("https://szarvaspongrac.hu");
const $$LogOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LogOut;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "log-out", ...Astro2.props }, { "default": /* @__PURE__ */ __name$3(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="m16 17 5-5-5-5"></path>
	<path d="M21 12H9"></path>
	<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/LogOut.astro", void 0);

var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", { value, configurable: true });
const $$Astro$1 = createAstro("https://szarvaspongrac.hu");
const $$Mail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Mail;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "mail", ...Astro2.props }, { "default": /* @__PURE__ */ __name$2(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
	<rect x="2" y="4" width="20" height="16" rx="2"></rect>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/Mail.astro", void 0);

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
const $$Astro = createAstro("https://szarvaspongrac.hu");
const $$User = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$User;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "user", ...Astro2.props }, { "default": /* @__PURE__ */ __name$1(($$result2) => renderTemplate`
	${maybeRenderHead()}<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/node_modules/lucide-astro/dist/User.astro", void 0);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "title": "Admin - Szarvas Pongr\xE1c", "description": "Adminisztr\xE1ci\xF3s ter\xFClet", "pageTitle": "Admin" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="max-w-md mx-auto">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div data-auth="false" class="hidden">
          <h2 class="card-title justify-center text-2xl mb-6">Bejelentkezés</h2>
          <form id="login-form">
            <div>
              <div class="flex items-center gap-2 mb-2">
                ${renderComponent($$result2, "Mail", $$Mail, { "class": "w-4 h-4 text-primary" })}
                <label class="label-text font-medium">Email</label>
              </div>
              <input type="email" id="email" class="input input-bordered input-primary w-full" placeholder="email@example.com" autocomplete="email" required>
            </div>
            <div class="form-control mt-4">
              <div class="flex items-center gap-2 mb-2">
                ${renderComponent($$result2, "Lock", $$Lock, { "class": "w-4 h-4 text-primary" })}
                <label class="label-text font-medium">Jelszó</label>
              </div>
              <input type="password" id="password" class="input input-bordered input-primary w-full" placeholder="••••••••" autocomplete="current-password" required>
            </div>
            <div class="form-control mt-8">
              <button type="submit" class="btn btn-primary btn-block">
                Bejelentkezés
              </button>
            </div>
            <div id="message" class="mt-4 text-center">
            </div>
          </form>
        </div>

        <div data-auth="true" class="hidden text-center">
          ${renderComponent($$result2, "User", $$User, { "class": "w-16 h-16 mx-auto text-primary mb-4" })}
          <h2 class="card-title justify-center text-2xl mb-2">Üdvözöljük!</h2>
          <p data-email class="text-lg mb-6">
          </p>
          <button data-logout class="btn btn-outline btn-error btn-block">
            ${renderComponent($$result2, "LogOut", $$LogOut, { "class": "w-4 h-4 mr-2" })}
            Kijelentkezés
          </button>
        </div>
      </div>
    </div>
  </div>
`, "default") })}`;
}, "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/admin.astro", void 0);

const $$file = "/Users/szarvaspeter/projects/szarvaspongrac/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Admin,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
