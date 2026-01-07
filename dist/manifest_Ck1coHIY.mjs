import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { NOOP_MIDDLEWARE_HEADER, decodeKey } from './chunks/astro/server_DVxX00a6.mjs';
import 'cookie';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/szarvaspeter/projects/szarvaspongrac/","cacheDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/node_modules/.astro/","outDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/","srcDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/src/","publicDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/public/","buildClientDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/client/","buildServerDir":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/server/","adapterName":"","routes":[{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/eletrajz/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/eletrajz","isIndex":false,"type":"page","pattern":"^\\/eletrajz\\/?$","segments":[[{"content":"eletrajz","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/eletrajz.astro","pathname":"/eletrajz","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kapcsolat/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kapcsolat","isIndex":false,"type":"page","pattern":"^\\/kapcsolat\\/?$","segments":[[{"content":"kapcsolat","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kapcsolat.astro","pathname":"/kapcsolat","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/akvarell/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet/akvarell","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/akvarell\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}],[{"content":"akvarell","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet/akvarell.astro","pathname":"/kepzomuveszet/akvarell","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/grafika/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet/grafika","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/grafika\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}],[{"content":"grafika","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet/grafika.astro","pathname":"/kepzomuveszet/grafika","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/illusztracio/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet/illusztracio","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/illusztracio\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}],[{"content":"illusztracio","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet/illusztracio.astro","pathname":"/kepzomuveszet/illusztracio","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/olaj/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet/olaj","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/olaj\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}],[{"content":"olaj","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet/olaj.astro","pathname":"/kepzomuveszet/olaj","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/pasztell/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet/pasztell","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/pasztell\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}],[{"content":"pasztell","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet/pasztell.astro","pathname":"/kepzomuveszet/pasztell","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kepzomuveszet","isIndex":false,"type":"page","pattern":"^\\/kepzomuveszet\\/?$","segments":[[{"content":"kepzomuveszet","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kepzomuveszet.astro","pathname":"/kepzomuveszet","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/szarvaspeter/projects/szarvaspongrac/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://szarvaspongrac.hu","base":"/","trailingSlash":"ignore","compressHTML":false,"componentMetadata":[["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kapcsolat.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/akvarell.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/grafika.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/illusztracio.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/olaj.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet/pasztell.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/kepzomuveszet.astro",{"propagation":"none","containsHead":true}],["/Users/szarvaspeter/projects/szarvaspongrac/src/pages/eletrajz.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/eletrajz@_@astro":"pages/eletrajz.astro.mjs","\u0000@astro-page:src/pages/kapcsolat@_@astro":"pages/kapcsolat.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet/akvarell@_@astro":"pages/kepzomuveszet/akvarell.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet/grafika@_@astro":"pages/kepzomuveszet/grafika.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet/illusztracio@_@astro":"pages/kepzomuveszet/illusztracio.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet/olaj@_@astro":"pages/kepzomuveszet/olaj.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet/pasztell@_@astro":"pages/kepzomuveszet/pasztell.astro.mjs","\u0000@astro-page:src/pages/kepzomuveszet@_@astro":"pages/kepzomuveszet.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_Ck1coHIY.mjs","/Users/szarvaspeter/projects/szarvaspongrac/src/components/ArtCard.astro?astro&type=script&index=0&lang.ts":"assets/ArtCard.astro_astro_type_script_index_0_lang.CKF01e-t.js","/Users/szarvaspeter/projects/szarvaspongrac/src/components/ImageUpload.astro?astro&type=script&index=0&lang.ts":"assets/ImageUpload.astro_astro_type_script_index_0_lang.BFQYCsvT.js","@astrojs/solid-js/client.js":"assets/client.x9auxHB8.js","/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"assets/BaseLayout.astro_astro_type_script_index_0_lang.RCLxJp4E.js","@components/Editor":"assets/Editor.D7Mtl-gw.js","/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/GalleryLayout.astro?astro&type=script&index=0&lang.ts":"assets/GalleryLayout.astro_astro_type_script_index_0_lang.CFGW9joU.js","/Users/szarvaspeter/projects/szarvaspongrac/src/layouts/ProseLayout.astro?astro&type=script&index=0&lang.ts":"assets/ProseLayout.astro_astro_type_script_index_0_lang.DzFQzbr_.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/admin/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/eletrajz/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kapcsolat/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/akvarell/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/grafika/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/illusztracio/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/olaj/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/pasztell/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/kepzomuveszet/index.html","/file:///Users/szarvaspeter/projects/szarvaspongrac/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"allowedDomains":[],"serverIslandNameMap":[],"key":"qxzTnkGqRXNYJ/dITfPULn1cKYDzmvt3+zeRQ5pFuk0="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
