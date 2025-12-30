// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";

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
    build: {
      minify: false,
    },
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/pb_data_dev/**", "**/pb_data/**"],
      },
    },
  },
});
