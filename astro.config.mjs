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
  image: {
    // Enable image optimization and caching
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        // Enable efficient image formats
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
  },
});
