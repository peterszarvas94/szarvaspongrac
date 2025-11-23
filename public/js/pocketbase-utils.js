// PocketBase utility functions - ESM module

export function createPbHelper(pb) {
  return {
    async login(email, password) {
      try {
        const authData = await pb
          .collection("users")
          .authWithPassword(email, password);
        console.log("✅ Login successful:", authData.record.email);
        return { success: true, data: authData };
      } catch (error) {
        console.error("❌ Login failed:", error);
        return { success: false, error: error.message };
      }
    },

    async getRecords(collection) {
      try {
        const records = await pb.collection(collection).getList();
        console.log(
          `✅ Got ${records.items.length} records from ${collection}`,
        );
        return { success: true, data: records };
      } catch (error) {
        console.error(`❌ Get records failed:`, error);
        return { success: false, error: error.message };
      }
    },

    isLoggedIn() {
      return pb.authStore.isValid;
    },

    getCurrentUser() {
      return pb.authStore.model;
    },
  };
}

export const config = {
  defaultUrl: "http://127.0.0.1:8090",
};

console.log("📦 PocketBase utils loaded as ESM module");
