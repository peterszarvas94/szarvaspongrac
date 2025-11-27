import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);

/** @param {string} key */
function createFilter(key) {
  return `key="${key}"`;
}

/** @param {string[]} filters */
function combineFilters(filters) {
  if (filters.length > 1) {
    return `(${filters.join(")||(")})`;
  }
  return filters[0];
}

/**
 * @param {string} collection
 * @param {(element: HTMLElement, item: any) => void} transformer
 **/
async function updateElementsOnPage(collection, transformer) {
  /** @type {NodeListOf<HTMLElement>} */
  const elementsOnPage = document.querySelectorAll(`[data-${collection}]`);
  const elements = Array.from(elementsOnPage);
  if (!elements.length) return;

  const filters = elements
    .map((element) => element.dataset[collection])
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);

  const items = await pb
    .collection(collection)
    .getFullList({ filter: combined });

  elements.forEach((element) => {
    const item = items.find((item) => item.key === element.dataset[collection]);
    if (item) {
      transformer(element, item);
    }
  });
}

async function updateAll() {
  await updateElementsOnPage("content", (element, item) => {
    element.innerHTML = item.value;
  });
  await updateElementsOnPage("link", (element, item) => {
    element.setAttribute("href", item.url);
    element.querySelector("span").innerHTML = item.text;
  });
}

export async function init() {
  // first update on load
  await updateAll();

  // dev server page nav
  document.addEventListener("astro:page-load", updateAll);
}

init();
