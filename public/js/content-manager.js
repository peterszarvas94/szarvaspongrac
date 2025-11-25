import PocketBase from "pocketbase";
import { PB_URL } from "env";

/** @type {PocketBase | null} */
let pbInstance = null;

/**
 * Gets or creates a PocketBase instance
 * @returns {PocketBase} The PocketBase instance
 */
function getPocketBase() {
  if (!pbInstance) {
    pbInstance = new PocketBase(PB_URL);
  }
  return pbInstance;
}

/**
 * @param {string} collection
 * @param {string} key
 * @returns {any}
 */
async function getItem(collection, key) {
  try {
    const pb = getPocketBase();
    const item = await pb
      .collection(collection)
      .getFirstListItem(`key="${key}"`);
    return item;
  } catch (error) {
    console.warn(`Failed to fetch ${key}:`, error);
    return null;
  }
}

/**
 * @param {HTMLElement} element
 * @param {string} key
 * @returns
 */
async function updateContentElement(element, key) {
  const item = await getItem("content", key);
  if (item) {
    element.innerHTML = item.value;
  } else {
    // Display the key if no content found, so we know what's missing
    element.innerHTML = `[${key}]`;
  }
}

/**
 * @param {HTMLElement} element
 * @param {string} key
 * @returns
 */
async function updateLinkElement(element, key) {
  const item = await getItem("link", key);
  if (item) {
    element.setAttribute("href", item.url);
    const textElement = element.querySelector("span");
    textElement.innerText = item.text;
  } else {
    // Display the key if no content found, so we know what's missing
    element.innerHTML = `[${key}]`;
  }
}
async function initContentManager() {
  const contentElements = document.querySelectorAll(`[data-content]`);
  for (const element of contentElements) {
    await updateContentElement(element, element.dataset.content);
  }

  const linkElements = document.querySelectorAll(`[data-link]`);
  for (const element of linkElements) {
    await updateLinkElement(element, element.dataset.link);
  }

  // const imageElements = document.querySelectorAll(`[data-image]`);
  // for (const element of contentElements) {
  //   await updateImageElement(element, element.dataset.image);
  // }
}

export async function init() {
  document.addEventListener("astro:page-load", initContentManager);
  await initContentManager();
}
