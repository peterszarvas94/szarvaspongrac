import { getCoverImageUrl } from './db.B2Whiv5I.js';
import './pocketbase.BNTe72gt.js';

const coverImages = document.querySelectorAll("[data-cover]");
await Promise.all(
  Array.from(coverImages).map(async (img) => {
    const key = img.dataset.cover;
    if (!key) return;
    const coverUrl = await getCoverImageUrl(key);
    if (!coverUrl) return;
    img.src = coverUrl;
    img.onload = () => img.classList.replace("opacity-0", "opacity-100");
  })
);
