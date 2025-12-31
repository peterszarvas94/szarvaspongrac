import { b as getImageUrls } from './db.D1KCNAzE.js';
import './edit.DLHOFmK1.js';
import './content-manager.DWZ6a-nb.js';

async function init() {
  const img = document.querySelector("[data-image]");
  if (!img) return;
  const key = img.dataset.image ?? "";
  const images = await getImageUrls(key);
  if (images.length > 0) {
    img.setAttribute("src", images[0].url);
  }
}
init();
document.addEventListener("astro:page-load", init);
