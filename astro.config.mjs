// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://szarvaspongrac.hu",
  build: {
    assets: "assets",
  },
  compressHTML: false,
  vite: {
    build: {
      minify: false,
    },
    plugins: [tailwindcss()],
  },
});
