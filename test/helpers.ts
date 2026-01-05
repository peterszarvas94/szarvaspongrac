import PocketBase from "pocketbase";
import { readFileSync } from "fs";
import { resolve } from "path";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "testpassword123";
const PB_URL = "http://127.0.0.1:8090";

export function getTestCredentials() {
  return { email: TEST_EMAIL, password: TEST_PASSWORD };
}

export async function getTestPb(): Promise<PocketBase> {
  const pb = new PocketBase(PB_URL);
  const { email, password } = getTestCredentials();
  await pb.collection("_superusers").authWithPassword(email, password);
  return pb;
}

export async function cleanupTestRecords(
  pb: PocketBase,
  collection: string,
  filter: string,
): Promise<void> {
  try {
    const records = await pb
      .collection(collection)
      .getFullList({ filter, requestKey: null });
    await Promise.all(
      records.map((r) => pb.collection(collection).delete(r.id)),
    );
  } catch {
    // Ignore errors if records don't exist
  }
}

const TEST_IMAGE_PATH = resolve(__dirname, "fixtures/test-image.jpg");
const TEST_IMAGE_BYTES = readFileSync(TEST_IMAGE_PATH);

export function createTestImageFile(name = "test.jpg"): File {
  return new File([TEST_IMAGE_BYTES], name, { type: "image/jpeg" });
}
