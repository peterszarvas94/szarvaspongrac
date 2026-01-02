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
    const images = await pb.collection("image").getFullList({ filter: `key="${key}"` });
    return images.map((record) => ({
      id: record.id,
      url: getURLFromRecord(record),
      filename: record.file
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
    const items = await pb.collection(collection).getFullList({ filter });
    return items;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
async function getContent(key) {
  try {
    const records = await pb.collection("content").getFullList({ filter: `key="${key}"` });
    return records.length > 0 ? records[0].value : "";
  } catch (error) {
    console.error("Failed to load content:", error);
    return "";
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

export { combineFilters, createFilter, deleteImage, getCollection, getContent, getCurrentUser, getImageUrls, getURLFromRecord, isAuthenticated, login, logout, pb, saveContent };
