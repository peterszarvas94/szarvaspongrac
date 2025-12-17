import { getImageUrls } from "db";

async function init() {
  const img = /** @type {HTMLImageElement | null} */ (
    document.querySelector("[data-image]")
  );
  if (!img) return;

  const key = img.dataset.image ?? "";
  const image = (await getImageUrls(key))[0];
  img.setAttribute("src", image.url);
}

await init();
document.addEventListener("astro:page-load", init);
