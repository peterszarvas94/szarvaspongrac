import PocketBase from "pocketbase";

let pbInstance = null;
const cacheKey = "szp_content";
const cacheExpiry = 3600000;

function getPocketBase() {
  if (!pbInstance) {
    pbInstance = new PocketBase("http://127.0.0.1:8090");
  }
  return pbInstance;
}

function loadFromCache(key) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const now = Date.now();

    if (!data[key] || now - data[key].timestamp > cacheExpiry) {
      return null;
    }

    return data[key].value;
  } catch (e) {
    return null;
  }
}

function saveToCache(key, value) {
  try {
    let cached = {};
    const existing = localStorage.getItem(cacheKey);
    if (existing) {
      cached = JSON.parse(existing);
    }

    cached[key] = {
      value: value,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (e) {
    console.warn("Failed to save to cache:", e);
  }
}

async function getContent(key) {
  const cached = loadFromCache(key);
  if (cached) return cached;

  try {
    const pb = getPocketBase();
    const records = await pb.collection("content_blocks").getList(1, 1, {
      filter: `key = "${key}"`,
    });

    const value = records.items[0]?.value || null;
    if (value) {
      saveToCache(key, value);
    }
    return value;
  } catch (e) {
    console.warn(`Failed to fetch ${key}:`, e);
    return null;
  }
}

async function updateElement(selector, key) {
  const element = document.querySelector(selector);
  if (!element) return;

  const content = await getContent(key);
  if (content) {
    element.innerHTML = content;
  }
}

function clearCache() {
  localStorage.removeItem(cacheKey);
}

async function refreshFromPocketBase() {
  try {
    const pb = getPocketBase();
    const records = await pb.collection("content_blocks").getList(1, 100);
    const data = {};

    records.items.forEach((item) => {
      data[item.key] = {
        value: item.value,
        timestamp: Date.now(),
      };
    });

    localStorage.setItem(cacheKey, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("Failed to refresh from PocketBase:", e);
    return false;
  }
}

export { updateElement, getContent, clearCache, refreshFromPocketBase };
