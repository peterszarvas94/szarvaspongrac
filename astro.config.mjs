// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import { fileURLToPath, URL } from "node:url";

// https://astro.build/config
export default defineConfig({
  site: "https://szarvaspongrac.hu",
  integrations: [mdx(), solidJs()],
  build: {
    assets: "assets",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        formats: ["webp", "avif"],
        quality: 85,
      },
    },
  },
  compressHTML: false,
  vite: {
    resolve: {
      alias: {
        "@scripts": fileURLToPath(new URL("./src/scripts", import.meta.url)),
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url),
        ),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
    build: {
      minify: false,
      cssMinify: false,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
          manualChunks(id) {
            if (id.includes("pocketbase")) {
              return "pocketbase";
            }
            if (id.includes("src/scripts/db.ts")) {
              return "db";
            }
          },
        },
      },
    },
    esbuild: {
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false,
      keepNames: true,
    },
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/pb_data_dev/**", "**/pb_data/**"],
      },
    },
  },
});
