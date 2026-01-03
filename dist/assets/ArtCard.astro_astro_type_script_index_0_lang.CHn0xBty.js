import { getCoverImageUrl } from './db.C5qaP7U7.js';
import './pocketbase.BNTe72gt.js';

async function initArtCardCovers() {
  const coverImages = document.querySelectorAll("[data-cover]");
  await Promise.all(
    Array.from(coverImages).map(async (img) => {
      const key = img.dataset.cover;
      if (!key) return;
      const coverUrl = await getCoverImageUrl(key);
      if (coverUrl) {
        img.src = coverUrl;
      }
    })
  );
}
initArtCardCovers();
