import { describe, it, expect, beforeAll } from "vitest";
import PocketBase from "pocketbase";
import { setup } from "./setup";
import { getTestCredentials } from "./helpers";

describe("auth", () => {
  let pb: PocketBase;

  beforeAll(() => {
    setup();
    pb = new PocketBase("http://127.0.0.1:8090");
  });

  it("should authenticate with test superuser", async () => {
    const { email, password } = getTestCredentials();

    const authData = await pb
      .collection("_superusers")
      .authWithPassword(email, password);

    expect(authData.record.email).toBe(email);
    expect(pb.authStore.isValid).toBe(true);
  });

  it("should fail with wrong password", async () => {
    const { email } = getTestCredentials();

    await expect(
      pb.collection("_superusers").authWithPassword(email, "wrongpassword"),
    ).rejects.toThrow();
  });

  it("should logout successfully", async () => {
    const { email, password } = getTestCredentials();

    await pb.collection("_superusers").authWithPassword(email, password);
    expect(pb.authStore.isValid).toBe(true);

    pb.authStore.clear();
    expect(pb.authStore.isValid).toBe(false);
  });
});
