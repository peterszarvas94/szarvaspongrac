// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://szarvaspongrac.hu",
  integrations: [mdx()],
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
