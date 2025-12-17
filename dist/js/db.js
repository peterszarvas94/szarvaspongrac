import PocketBase from "pocketbase";
import { PB_URL } from "env";

export const pb = new PocketBase(PB_URL);

/**
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  try {
    await pb.collection("_superusers").authWithPassword(email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  try {
    pb.authStore.clear();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

export function isAuthenticated() {
  return pb.authStore.isValid;
}

/**
 * @returns {Object | null} User data or null
 */
export function getCurrentUser() {
  return pb.authStore.record;
}

/** @param {string} key */
export async function getImageUrls(key) {
  try {
    const images = await pb
      .collection("image")
      .getFullList({ filter: `key="${key}"` });

    return images.map((record) => ({
      id: record.id,
      url: pb.files.getURL(record, record.file),
      filename: record.file,
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

/** @param {string} id */
export async function deleteImage(id) {
  try {
    await pb.collection("image").delete(id);
  } catch (error) {
    console.error("Delete error:", error);
    return;
  }
}

/** @param {string} key */
export function createFilter(key) {
  return `key="${key}"`;
}

/** @param {string[]} filters */
export function combineFilters(filters) {
  if (filters.length > 1) {
    return `(${filters.join(")||(")})`;
  }
  return filters[0];
}

/**
 * @param {string} collection
 * @param {string} filter
 **/
export async function getCollection(collection, filter) {
  try {
    const items = await pb.collection(collection).getFullList({ filter });
    return items;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
