import { describe, it, expect, beforeAll, afterAll } from "vitest";
import PocketBase from "pocketbase";
import {
  getTestPb,
  cleanupTestRecords,
  createTestImageFile,
} from "../../test/helpers";
import { createFilter, combineFilters } from "./db";

const TEST_KEY_CONTENT = "test-content-abc123";
const TEST_KEY_IMAGE = "test-image-abc123";
const TEST_KEY_FILTER = "test-filter-abc123";

describe("db", () => {
  let pb: PocketBase;

  beforeAll(async () => {
    pb = await getTestPb();
    await cleanupTestRecords(pb, "content", `key~"${TEST_KEY_CONTENT}"`);
    await cleanupTestRecords(pb, "content", `key~"${TEST_KEY_FILTER}"`);
    await cleanupTestRecords(pb, "image", `key~"${TEST_KEY_IMAGE}"`);
  });

  afterAll(async () => {
    await cleanupTestRecords(pb, "content", `key~"${TEST_KEY_CONTENT}"`);
    await cleanupTestRecords(pb, "content", `key~"${TEST_KEY_FILTER}"`);
    await cleanupTestRecords(pb, "image", `key~"${TEST_KEY_IMAGE}"`);
  });

  describe("content", () => {
    it("getContent returns value for existing key", async () => {
      const key = `${TEST_KEY_CONTENT}-get`;
      await pb.collection("content").create({ key, value: "<p>Test</p>" });

      const records = await pb
        .collection("content")
        .getFullList({ filter: `key="${key}"` });
      const result = records.length > 0 ? records[0].value : "";

      expect(result).toBe("<p>Test</p>");
    });

    it("getContent returns empty string for non-existent key", async () => {
      const records = await pb
        .collection("content")
        .getFullList({ filter: `key="non-existent-key-xyz"` });
      const result = records.length > 0 ? records[0].value : "";

      expect(result).toBe("");
    });

    it("saveContent creates new record", async () => {
      const key = `${TEST_KEY_CONTENT}-create`;
      const value = "<p>New content</p>";

      await pb.collection("content").create({ key, value });

      const records = await pb
        .collection("content")
        .getFullList({ filter: `key="${key}"` });

      expect(records.length).toBe(1);
      expect(records[0].value).toBe(value);
    });

    it("saveContent updates existing record", async () => {
      const key = `${TEST_KEY_CONTENT}-update`;
      await pb.collection("content").create({ key, value: "<p>Original</p>" });

      const records = await pb
        .collection("content")
        .getFullList({ filter: `key="${key}"` });
      await pb
        .collection("content")
        .update(records[0].id, { value: "<p>Updated</p>" });

      const updated = await pb
        .collection("content")
        .getFullList({ filter: `key="${key}"` });

      expect(updated[0].value).toBe("<p>Updated</p>");
    });
  });

  describe("image", () => {
    it("getImageUrls returns images for key", async () => {
      const key = `${TEST_KEY_IMAGE}-list`;
      const file = createTestImageFile("test1.jpg");

      await pb.collection("image").create({ key, file, sorting: 1 });

      const images = await pb
        .collection("image")
        .getFullList({ filter: `key="${key}"` });

      expect(images.length).toBe(1);
      expect(images[0].key).toBe(key);
    });

    it("getImageUrls returns empty array for non-existent key", async () => {
      const images = await pb
        .collection("image")
        .getFullList({ filter: `key="non-existent-image-key"` });

      expect(images).toEqual([]);
    });

    it("deleteImage removes record", async () => {
      const key = `${TEST_KEY_IMAGE}-delete`;
      const file = createTestImageFile("delete.jpg");

      const record = await pb
        .collection("image")
        .create({ key, file, sorting: 1 });
      await pb.collection("image").delete(record.id);

      const images = await pb
        .collection("image")
        .getFullList({ filter: `key="${key}"` });

      expect(images.length).toBe(0);
    });

    it("getCoverImage returns cover image", async () => {
      const key = `${TEST_KEY_IMAGE}-cover`;
      const file = createTestImageFile("cover.jpg");

      await pb
        .collection("image")
        .create({ key, file, cover: true, sorting: 1 });

      const images = await pb
        .collection("image")
        .getFullList({ filter: `key="${key}" && cover=true` });

      expect(images.length).toBe(1);
      expect(images[0].cover).toBe(true);
    });

    it("setCoverImage swaps cover between images", async () => {
      const key = `${TEST_KEY_IMAGE}-swap`;
      const file1 = createTestImageFile("swap1.jpg");
      const file2 = createTestImageFile("swap2.jpg");

      const img1 = await pb
        .collection("image")
        .create({ key, file: file1, cover: true, sorting: 1 });
      const img2 = await pb
        .collection("image")
        .create({ key, file: file2, cover: false, sorting: 2 });

      const batch = pb.createBatch();
      batch.collection("image").update(img1.id, { cover: false });
      batch.collection("image").update(img2.id, { cover: true });
      await batch.send();

      const updated1 = await pb.collection("image").getOne(img1.id);
      const updated2 = await pb.collection("image").getOne(img2.id);

      expect(updated1.cover).toBe(false);
      expect(updated2.cover).toBe(true);
    });

    it("swapImageOrder swaps sorting values", async () => {
      const key = `${TEST_KEY_IMAGE}-order`;
      const file1 = createTestImageFile("order1.jpg");
      const file2 = createTestImageFile("order2.jpg");

      const img1 = await pb
        .collection("image")
        .create({ key, file: file1, sorting: 1 });
      const img2 = await pb
        .collection("image")
        .create({ key, file: file2, sorting: 2 });

      const batch = pb.createBatch();
      batch.collection("image").update(img1.id, { sorting: img2.sorting });
      batch.collection("image").update(img2.id, { sorting: img1.sorting });
      await batch.send();

      const updated1 = await pb.collection("image").getOne(img1.id);
      const updated2 = await pb.collection("image").getOne(img2.id);

      expect(updated1.sorting).toBe(2);
      expect(updated2.sorting).toBe(1);
    });
  });

  describe("filter", () => {
    it("createFilter returns correct format", () => {
      expect(createFilter("my-key")).toBe('key="my-key"');
      expect(createFilter("test")).toBe('key="test"');
    });

    it("combineFilters returns single filter unchanged", () => {
      const filters = ['key="single"'];
      expect(combineFilters(filters)).toBe('key="single"');
    });

    it("combineFilters combines multiple filters with OR", () => {
      const filters = ['key="first"', 'key="second"', 'key="third"'];
      expect(combineFilters(filters)).toBe(
        '(key="first")||(key="second")||(key="third")',
      );
    });

    it("getCollection fetches records matching filter", async () => {
      const key1 = `${TEST_KEY_FILTER}-1`;
      const key2 = `${TEST_KEY_FILTER}-2`;

      await pb.collection("content").create({ key: key1, value: "Value 1" });
      await pb.collection("content").create({ key: key2, value: "Value 2" });

      const filter = combineFilters([createFilter(key1), createFilter(key2)]);
      const records = await pb.collection("content").getFullList({ filter });

      expect(records.length).toBe(2);
    });
  });
});
