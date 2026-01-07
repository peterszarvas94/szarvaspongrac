import { setCachedContent } from "@scripts/content-cache";
import { combineFilters, createFilter, getCollection } from "@scripts/db";
import { parseDataAttr } from "@scripts/utils";

interface CollectionItem {
  key: string;
  value?: string;
  url?: string;
  text?: string;
}

async function updateElementsOnPage(
  collection: string,
  transformer: (element: HTMLElement, item: CollectionItem) => void,
) {
  const allPbElements = document.querySelectorAll<HTMLElement>("[data-pb]");
  const elements = Array.from(allPbElements).filter((el) => {
    const parsed = parseDataAttr(el.dataset.pb || "");
    return parsed?.collection === collection;
  });

  if (!elements.length) return;

  const filters = elements
    .map((element) => parseDataAttr(element.dataset.pb || "")?.key)
    .filter((key): key is string => key !== undefined)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);
  const items = (await getCollection(
    collection,
    combined,
  )) as unknown as CollectionItem[];

  elements.forEach((element) => {
    const parsed = parseDataAttr(element.dataset.pb || "");
    if (!parsed) return;
    const item = items.find((item) => item.key === parsed.key);
    if (item) {
      transformer(element, item);
    }
  });

  return items;
}

export async function updateContentsOnPage() {
  const items = await updateElementsOnPage("content", (element, item) => {
    element.innerHTML = item.value ?? "";
  });

  // Cache content for Editor to use
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
