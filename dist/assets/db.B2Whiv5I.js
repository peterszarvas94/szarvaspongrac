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
    const images = await pb.collection("image").getFullList({
      filter: `key="${key}"`,
      requestKey: null
    });
    return images.map((record) => ({
      id: record.id,
      url: getURLFromRecord(record),
      filename: record.file,
      cover: record.cover ?? false,
      sorting: record.sorting ?? 0
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
async function reorderImages(draggedId, targetId, items) {
  try {
    const draggedIndex = items.findIndex((item) => item.id === draggedId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) {
      throw new Error("Could not find dragged or target image");
    }
    const newOrder = [...items];
    const draggedItem = newOrder.splice(draggedIndex, 1)[0];
    const insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
    newOrder.splice(insertIndex, 0, draggedItem);
    const batch = pb.createBatch();
    for (let i = 0; i < newOrder.length; i++) {
      const newSorting = i + 1;
      if (newOrder[i].sorting !== newSorting) {
        batch.collection("image").update(newOrder[i].id, { sorting: newSorting });
      }
    }
    await batch.send({
      requestKey: `reorder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error("Reorder error:", error);
    throw error;
  }
}

export { combineFilters, createFilter, deleteImage, getCollection, getCoverImageUrl, getCurrentUser, getImageUrls, getURLFromRecord, isAuthenticated, login, logout, pb, reorderImages, saveContent, setCoverImage };
