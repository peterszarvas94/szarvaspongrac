import { combineFilters, createFilter, getCollection } from "@lib/db";

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
  const elementsOnPage = document.querySelectorAll<HTMLElement>(
    `[data-${collection}]`,
  );
  const elements = Array.from(elementsOnPage);
  if (!elements.length) return;

  const filters = elements
    .map((element) => element.dataset[collection])
    .filter((key): key is string => key !== undefined)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);
  const items = (await getCollection(
    collection,
    combined,
  )) as unknown as CollectionItem[];

  elements.forEach((element) => {
    const item = items.find((item) => item.key === element.dataset[collection]);
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
