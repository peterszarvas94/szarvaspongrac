/// <reference types="astro/client" />
import PocketBase from "pocketbase";

export const PB_URL = import.meta.env.PUBLIC_PB_URL;
export const pb = new PocketBase(PB_URL);

/** Get content value by key */
export async function getContent(key: string): Promise<string> {
  try {
    const records = await pb
      .collection("content")
      .getFullList({ filter: `key="${key}"` });
    return records.length > 0 ? records[0].value : "";
  } catch (error) {
    console.error("Failed to load content:", error);
    return "";
  }
}
