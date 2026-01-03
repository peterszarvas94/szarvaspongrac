import { Client } from './pocketbase.BNTe72gt.js';

const pb = new Client("https://pb.szarvaspongrac.hu");
async function login(email, password) {
  try {
    await pb.collection("_superusers").authWithPassword(email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
async function logout() {
  try {
    pb.authStore.clear();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
function isAuthenticated() {
  return pb.authStore.isValid;
}
function getCurrentUser() {
  return pb.authStore.record;
}
function getURLFromRecord(record) {
  return pb.files.getURL(record, record.file);
}
async function getImageUrls(key) {
  try {
    const images = await pb.collection("image").getFullList({ filter: `key="${key}"`, sort: "sorting" });
    return images.map((record) => ({
      id: record.id,
      url: getURLFromRecord(record),
      filename: record.file,
      cover: record.cover ?? false
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
async function deleteImage(id) {
  try {
    await pb.collection("image").delete(id);
  } catch (error) {
    console.error("Delete error:", error);
  }
}
async function setCoverImage(id, key) {
  try {
    const existingCovers = await pb.collection("image").getFullList({ filter: `key="${key}" && cover=true` });
    for (const cover of existingCovers) {
      await pb.collection("image").update(cover.id, { cover: false });
    }
    await pb.collection("image").update(id, { cover: true });
  } catch (error) {
    console.error("Set cover error:", error);
    throw error;
  }
}
async function getCoverImageUrl(key) {
  try {
    const images = await pb.collection("image").getFullList({
      filter: `(key="${key}" && cover=true)`,
      requestKey: null
    });
    if (images.length > 0) {
      return getURLFromRecord(images[0]);
    }
    return null;
  } catch (error) {
    console.error("Get cover image error:", error);
    return null;
  }
}
function createFilter(key) {
  return `key="${key}"`;
}
function combineFilters(filters) {
  if (filters.length > 1) {
    return `(${filters.join(")||(")})`;
  }
  return filters[0];
}
async function getCollection(collection, filter) {
  try {
    const items = await pb.collection(collection).getFullList({ filter, requestKey: null });
    return items;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
async function saveContent(key, value) {
  const records = await pb.collection("content").getFullList({ filter: `key="${key}"` });
  if (records.length > 0) {
    await pb.collection("content").update(records[0].id, { value });
  } else {
    await pb.collection("content").create({ key, value });
  }
}

export { combineFilters, createFilter, deleteImage, getCollection, getCoverImageUrl, getCurrentUser, getImageUrls, getURLFromRecord, isAuthenticated, login, logout, pb, saveContent, setCoverImage };
