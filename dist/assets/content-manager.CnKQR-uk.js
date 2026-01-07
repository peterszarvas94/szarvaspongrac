import { setCachedContent, createFilter, combineFilters, getCollection } from './db.DZiNoy5o.js';

function parseDataAttr(value) {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}
function getMaxSorting(sortingValues) {
  if (sortingValues.length === 0) return 0;
  return Math.max(...sortingValues);
}
function isDuplicateFile(file, existingFiles) {
  return existingFiles.some(
    (existing) => existing.name === file.name && existing.size === file.size
  );
}

async function updateElementsOnPage(collection, transformer) {
  const allPbElements = document.querySelectorAll("[data-pb]");
  const elements = Array.from(allPbElements).filter((el) => {
    const parsed = parseDataAttr(el.dataset.pb || "");
    return parsed?.collection === collection;
  });
  if (!elements.length) return;
  const filters = elements.map((element) => parseDataAttr(element.dataset.pb || "")?.key).filter((key) => key !== void 0).map((key) => createFilter(key));
  const combined = combineFilters(filters);
  const items = await getCollection(
    collection,
    combined
  );
  elements.forEach((element) => {
    const parsed = parseDataAttr(element.dataset.pb || "");
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
      setCachedContent(item.key, item.value);
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
await updateContentsOnPage();
await updateLinksOnPage();

export { getMaxSorting, isDuplicateFile, parseDataAttr, updateContentsOnPage };
