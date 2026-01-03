/// <reference types="astro/client" />
import PocketBase, { type RecordModel } from "pocketbase";

export const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);

export async function login(email: string, password: string) {
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

export function getCurrentUser() {
  return pb.authStore.record;
}

export function getURLFromRecord(record: RecordModel) {
  return pb.files.getURL(record, record.file);
}

export async function getImageUrls(key: string) {
  try {
    const images = await pb
      .collection("image")
      .getFullList({ filter: `key="${key}"`, sort: "sorting" });

    return images.map((record) => ({
      id: record.id,
      url: getURLFromRecord(record),
      filename: record.file,
      cover: record.cover ?? false,
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function deleteImage(id: string) {
  try {
    await pb.collection("image").delete(id);
  } catch (error) {
    console.error("Delete error:", error);
  }
}

export async function setCoverImage(id: string, key: string) {
  try {
    // First, unset any existing cover images for this key
    const existingCovers = await pb
      .collection("image")
      .getFullList({ filter: `key="${key}" && cover=true` });

    for (const cover of existingCovers) {
      await pb.collection("image").update(cover.id, { cover: false });
    }

    // Then set the new cover image
    await pb.collection("image").update(id, { cover: true });
  } catch (error) {
    console.error("Set cover error:", error);
    throw error;
  }
}

export async function getCoverImageUrl(key: string): Promise<string | null> {
  try {
    const images = await pb.collection("image").getFullList({
      filter: `(key="${key}" && cover=true)`,
      requestKey: null,
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

export function createFilter(key: string) {
  return `key="${key}"`;
}

export function combineFilters(filters: string[]) {
  if (filters.length > 1) {
    return `(${filters.join(")||(")})`;
  }
  return filters[0];
}

export async function getCollection(collection: string, filter: string) {
  try {
    const items = await pb
      .collection(collection)
      .getFullList({ filter, requestKey: null });
    return items;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function getContent(key: string): Promise<string> {
  try {
    const records = await pb
      .collection("content")
      .getFullList({ filter: `key="${key}"`, requestKey: null });
    return records.length > 0 ? records[0].value : "";
  } catch (error) {
    console.error("Failed to load content:", error);
    return "";
  }
}

export async function saveContent(key: string, value: string): Promise<void> {
  const records = await pb
    .collection("content")
    .getFullList({ filter: `key="${key}"` });

  if (records.length > 0) {
    await pb.collection("content").update(records[0].id, { value });
  } else {
    await pb.collection("content").create({ key, value });
  }
}
