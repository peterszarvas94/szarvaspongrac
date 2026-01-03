import { getCoverImageUrl } from "@scripts/db";

async function initArtCardCovers() {
  const coverImages =
    document.querySelectorAll<HTMLImageElement>("[data-cover]");

  await Promise.all(
    Array.from(coverImages).map(async (img) => {
      const key = img.dataset.cover;
      if (!key) return;

      const coverUrl = await getCoverImageUrl(key);
      if (coverUrl) {
        img.src = coverUrl;
      }
    }),
  );
}

initArtCardCovers();
