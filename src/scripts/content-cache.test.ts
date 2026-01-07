import { describe, it, expect, beforeEach } from "vitest";
import { getCachedContent, setCachedContent } from "./content-cache";

describe("content-cache", () => {
  beforeEach(() => {
    // Clear cache by setting empty values (no clear method exposed)
    setCachedContent("test-key", "");
  });

  describe("setCachedContent", () => {
    it("stores content by key", () => {
      setCachedContent("my-key", "<p>Hello</p>");
      expect(getCachedContent("my-key")).toBe("<p>Hello</p>");
    });

    it("overwrites existing content", () => {
      setCachedContent("my-key", "old");
      setCachedContent("my-key", "new");
      expect(getCachedContent("my-key")).toBe("new");
    });
  });

  describe("getCachedContent", () => {
    it("returns undefined for non-existent key", () => {
      expect(getCachedContent("non-existent")).toBeUndefined();
    });

    it("returns stored content", () => {
      setCachedContent("content-key", "test content");
      expect(getCachedContent("content-key")).toBe("test content");
    });
  });
});
