import { combineFilters, createFilter, getCollection } from "@scripts/db";

interface CollectionItem {
  key: string;
  value?: string;
  url?: string;
  text?: string;
}

function parseDataPb(
  value: string,
): { collection: string; key: string } | null {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}

async function updateElementsOnPage(
  collection: string,
  transformer: (element: HTMLElement, item: CollectionItem) => void,
) {
  const allPbElements = document.querySelectorAll<HTMLElement>("[data-pb]");
  const elements = Array.from(allPbElements).filter((el) => {
    const parsed = parseDataPb(el.dataset.pb || "");
    return parsed?.collection === collection;
  });

  if (!elements.length) return;

  const filters = elements
    .map((element) => parseDataPb(element.dataset.pb || "")?.key)
    .filter((key): key is string => key !== undefined)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);
  const items = (await getCollection(
    collection,
    combined,
  )) as unknown as CollectionItem[];

  elements.forEach((element) => {
    const parsed = parseDataPb(element.dataset.pb || "");
    if (!parsed) return;
    const item = items.find((item) => item.key === parsed.key);
    if (item) {
      transformer(element, item);
    }
  });
}

export async function updateContentsOnPage() {
  await updateElementsOnPage("content", (element, item) => {
    element.innerHTML = item.value ?? "";
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
document.addEventListener("astro:page-load", init);
