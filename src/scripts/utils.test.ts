import { describe, it, expect } from "vitest";
import { parseDataAttr, getMaxSorting, isDuplicateFile } from "./utils";

describe("utils", () => {
  describe("parseDataAttr", () => {
    it("parses valid input", () => {
      expect(parseDataAttr("content:my-key")).toEqual({
        collection: "content",
        key: "my-key",
      });
    });

    it("parses different collections", () => {
      expect(parseDataAttr("image:gallery")).toEqual({
        collection: "image",
        key: "gallery",
      });
    });

    it("returns null for invalid input", () => {
      expect(parseDataAttr("invalid")).toBeNull();
      expect(parseDataAttr("")).toBeNull();
      expect(parseDataAttr(":")).toBeNull();
      expect(parseDataAttr("content:")).toBeNull();
      expect(parseDataAttr(":key")).toBeNull();
    });
  });

  describe("getMaxSorting", () => {
    it("returns 0 for empty array", () => {
      expect(getMaxSorting([])).toBe(0);
    });

    it("returns max value", () => {
      expect(getMaxSorting([1, 5, 3])).toBe(5);
    });

    it("handles single value", () => {
      expect(getMaxSorting([42])).toBe(42);
    });
  });

  describe("isDuplicateFile", () => {
    it("returns false for empty list", () => {
      const file = new File(["content"], "test.jpg");
      expect(isDuplicateFile(file, [])).toBe(false);
    });

    it("returns true for same name and size", () => {
      const file1 = new File(["content"], "test.jpg");
      const file2 = new File(["content"], "test.jpg");
      expect(isDuplicateFile(file2, [file1])).toBe(true);
    });

    it("returns false for same name different size", () => {
      const file1 = new File(["content"], "test.jpg");
      const file2 = new File(["different content"], "test.jpg");
      expect(isDuplicateFile(file2, [file1])).toBe(false);
    });

    it("returns false for different name same size", () => {
      const file1 = new File(["content"], "test1.jpg");
      const file2 = new File(["content"], "test2.jpg");
      expect(isDuplicateFile(file2, [file1])).toBe(false);
    });
  });
});
