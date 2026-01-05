import { describe, it, expect } from "vitest";
import { TypedEvent } from "./event";

describe("event", () => {
  describe("TypedEvent", () => {
    it("creates event with correct type and detail", () => {
      const event = new TypedEvent("test-event", { foo: "bar" });

      expect(event.type).toBe("test-event");
      expect(event.detail).toEqual({ foo: "bar" });
    });

    it("sets bubbles to true", () => {
      const event = new TypedEvent("test", {});
      expect(event.bubbles).toBe(true);
    });

    it("sets composed to true", () => {
      const event = new TypedEvent("test", {});
      expect(event.composed).toBe(true);
    });

    it("works with different detail types", () => {
      const stringEvent = new TypedEvent("string", { message: "hello" });
      expect(stringEvent.detail.message).toBe("hello");

      const numberEvent = new TypedEvent("number", { count: 42 });
      expect(numberEvent.detail.count).toBe(42);

      const boolEvent = new TypedEvent("bool", { active: true });
      expect(boolEvent.detail.active).toBe(true);
    });
  });
});
