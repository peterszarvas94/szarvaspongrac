import PocketBase from "pocketbase";
import { PB_URL } from "env";

/** @param {string} key */
function createFilter(key) {
  return `key="${key}"`;
}

/** @param {string[]} filters */
function combineFilters(filters) {
  return `(${filters.join(")||(")})`;
}

export async function updateContentElementsOnPage() {
  /** @type {NodeListOf<HTMLElement>} */
  const contentElementsOnPage = document.querySelectorAll(`[data-content]`);
  const elements = Array.from(contentElementsOnPage);
  if (!elements.length) return;

  const filters = elements
    .map((element) => element.dataset.content)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);

  const pb = new PocketBase(PB_URL);

  /** @type {{key: string, value: string}[]} */
  const contentsFromDb = await pb
    .collection("content")
    .getFullList({ filter: combined });

  elements.forEach((element) => {
    const content = contentsFromDb.find(
      (item) => item.key === element.dataset.content,
    ).value;
    element.innerHTML = content;
  });

  return contentsFromDb;
}

export async function updateLinkElementsOnPage() {
  /** @type {NodeListOf<HTMLElement>} */
  const contentElementsOnPage = document.querySelectorAll(`[data-link]`);
  const elements = Array.from(contentElementsOnPage);
  if (!elements.length) return;

  const filters = elements
    .map((element) => element.dataset.link)
    .map((key) => createFilter(key));

  const combined = combineFilters(filters);

  const pb = new PocketBase(PB_URL);

  /** @type {{key: string, text: string, url: string}[]} */
  const contentsFromDb = await pb
    .collection("link")
    .getFullList({ filter: combined });

  elements.forEach((element) => {
    const item = contentsFromDb.find(
      (item) => item.key === element.dataset.link,
    );
    element.querySelector("span").innerText = item.text;
    element.setAttribute("href", item.url);
  });

  return contentsFromDb;
}

async function initContentManager() {
  await updateContentElementsOnPage();
  await updateLinkElementsOnPage();
}

export async function init() {
  document.addEventListener("astro:page-load", initContentManager);
  await initContentManager();
}
