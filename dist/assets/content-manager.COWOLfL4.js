import { createFilter, combineFilters, getCollection } from './db.is84uKZZ.js';

const contentCache = /* @__PURE__ */ new Map();
function getCachedContent(key) {
  return contentCache.get(key);
}
function parseDataPb(value) {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}
async function updateElementsOnPage(collection, transformer) {
  const allPbElements = document.querySelectorAll("[data-pb]");
  const elements = Array.from(allPbElements).filter((el) => {
    const parsed = parseDataPb(el.dataset.pb || "");
    return parsed?.collection === collection;
  });
  if (!elements.length) return;
  const filters = elements.map((element) => parseDataPb(element.dataset.pb || "")?.key).filter((key) => key !== void 0).map((key) => createFilter(key));
  const combined = combineFilters(filters);
  const items = await getCollection(
    collection,
    combined
  );
  elements.forEach((element) => {
    const parsed = parseDataPb(element.dataset.pb || "");
    if (!parsed) return;
    const item = items.find((item2) => item2.key === parsed.key);
    if (item) {
      transformer(element, item);
    }
  });
  return items;
}
async function updateContentsOnPage() {
  const items = await updateElementsOnPage("content", (element, item) => {
    element.innerHTML = item.value ?? "";
  });
  items?.forEach((item) => {
    if (item.value) {
      contentCache.set(item.key, item.value);
    }
  });
}
async function updateLinksOnPage() {
  await updateElementsOnPage("link", (element, item) => {
    element.setAttribute("href", item.url ?? "");
    const span = element.querySelector("span");
    if (span) span.innerHTML = item.text ?? "";
  });
}
async function init() {
  await updateContentsOnPage();
  await updateLinksOnPage();
}
init();

export { getCachedContent, updateContentsOnPage };
