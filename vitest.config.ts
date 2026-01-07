import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    fileParallelism: false,
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "@scripts": path.resolve(__dirname, "./src/scripts"),
    },
  },
});
