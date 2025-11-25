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
 * Gets content by key from PocketBase (always fresh data)
 * @param {string} key - The content key to fetch
 * @returns {Promise<string | null>} The content value or null if not found
 */
async function getContent(key) {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("content").getList(1, 1, {
      filter: `key = "${key}"`,
    });

    return records.items[0]?.value || null;
  } catch (e) {
    console.warn(`Failed to fetch ${key}:`, e);
    return null;
  }
}

/**
 * Updates an HTML element's innerHTML with content from PocketBase
 * @param {HTMLElement} element - The DOM element to update
 * @param {string} key - The content key to fetch
 */
async function updateElement(element, key) {
  const content = await getContent(key);
  if (content) {
    element.innerHTML = content;
  } else {
    // Display the key if no content found, so we know what's missing
    element.innerHTML = `[Missing: ${key}]`;
    element.style.color = "red";
    element.style.fontStyle = "italic";
  }
}

async function initContentManager() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll("[data-content]");

  for (const element of elements) {
    const key = element.dataset.content;
    if (key) {
      await updateElement(element, key);
    }
  }
}

export async function init() {
  document.addEventListener("astro:page-load", initContentManager);
  await initContentManager();
}
