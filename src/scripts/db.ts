/// <reference types="astro/client" />
import { setCachedContent } from "@scripts/content-cache";
import PocketBase, { type RecordModel } from "pocketbase";
import { showAlert } from "./toaster";

export const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);

export async function login(email: string, password: string) {
  try {
    await pb.collection("_superusers").authWithPassword(email, password);
    showAlert("Sikeres bejelentkezés", "success");
  } catch (error) {
    showAlert("Nem sikerült bejelentkezni", "error");
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  try {
    pb.authStore.clear();
    showAlert("Sikeres kijelentkezés", "success");
  } catch (error) {
    console.error("Logout failed:", error);
    showAlert("Nem sikerült kijelentkezni", "error");
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

export async function getImages(key: string) {
  try {
    const images = await pb.collection("image").getFullList({
      filter: `key="${key}"`,
      requestKey: null,
    });

    return images.map((record) => ({
      id: record.id,
      url: getURLFromRecord(record),
      filename: record.file,
      cover: record.cover ?? false,
      sorting: (record.sorting as number) ?? 0,
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

export async function getCoverImage(key: string) {
  return await pb
    .collection("image")
    .getFirstListItem(`key="${key}" && cover=true`);
}

/** @return old cover image */
export async function setCoverImage(
  id: string,
  key: string,
): Promise<RecordModel | undefined> {
  let oldCover: RecordModel | undefined;
  try {
    oldCover = await getCoverImage(key);
  } catch (error) {
    console.error("Get cover error:", error);
  }

  try {
    const batch = pb.createBatch();
    if (oldCover) {
      batch.collection("image").update(oldCover.id, { cover: false });
    }
    batch.collection("image").update(id, { cover: true });

    await batch.send();

    return oldCover;
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

  setCachedContent(key, value);
}

export async function swapImageOrder(id1: string, id2: string): Promise<void> {
  const record1 = await pb.collection("image").getOne(id1);
  const record2 = await pb.collection("image").getOne(id2);

  const batch = pb.createBatch();
  batch.collection("image").update(id1, { sorting: record2.sorting });
  batch.collection("image").update(id2, { sorting: record1.sorting });
  await batch.send();
}
