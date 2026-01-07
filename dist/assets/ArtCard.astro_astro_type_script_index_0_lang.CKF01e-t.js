import { getCoverImageUrl } from './db.DZiNoy5o.js';
import './pocketbase.BNTe72gt.js';

const coverImages = document.querySelectorAll("[data-cover]");
await Promise.all(
  Array.from(coverImages).map(async (img) => {
    const key = img.dataset.cover;
    if (!key) return;
    const coverUrl = await getCoverImageUrl(key);
    if (!coverUrl) {
      const parent = img.parentElement;
      if (!parent) return;
      const tempate = document.querySelector(
        "template#missing-cover"
      );
      if (!tempate) return;
      const missingIcon = tempate?.content.cloneNode(true);
      if (!missingIcon) return;
      img.remove();
      parent.prepend(missingIcon);
      return;
    }
    img.src = coverUrl;
    img.onload = () => img.classList.replace("opacity-0", "opacity-100");
  })
);
