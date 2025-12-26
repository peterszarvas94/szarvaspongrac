import { combineFilters, createFilter, getCollection } from "db";

/**
 * @param {string} collection
 * @param {(element: HTMLElement, item: any) => void} transformer
 **/
export async function updateElementsOnPage(collection, transformer) {
  /** @type {NodeListOf<HTMLElement>} */
  const elementsOnPage = document.querySelectorAll(`[data-${collection}]`);
  const elements = Array.from(elementsOnPage);
  if (!elements.length) return;

  const filters = elements
    .map((element) => element.dataset[collection])

    .filter((key) => key !== undefined)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);

  const items = await getCollection(collection, combined);

  elements.forEach((element) => {
    const item = items.find((item) => item.key === element.dataset[collection]);
    if (item) {
      transformer(element, item);
    }
  });
}

async function init() {
  await updateElementsOnPage("content", (element, item) => {
    element.innerHTML = item.value;
  });
  await updateElementsOnPage("link", (element, item) => {
    element.setAttribute("href", item.url);
    const span = /** @type {HTMLSpanElement} */ (element.querySelector("span"));
    span.innerHTML = item.text;
  });
}

await init();
document.addEventListener("astro:page-load", init);
