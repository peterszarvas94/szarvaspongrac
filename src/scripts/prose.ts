import { getImageUrls } from "@lib/db";

async function init() {
  const img = document.querySelector<HTMLImageElement>("[data-image]");
  if (!img) return;

  const key = img.dataset.image ?? "";
  const images = await getImageUrls(key);
  if (images.length > 0) {
    img.setAttribute("src", images[0].url);
  }
}

init();
document.addEventListener("astro:page-load", init);
