import { getCoverImageUrl } from "@scripts/db";

const coverImages = document.querySelectorAll<HTMLImageElement>("[data-cover]");

await Promise.all(
  Array.from(coverImages).map(async (img) => {
    const key = img.dataset.cover;
    if (!key) return;

    const coverUrl = await getCoverImageUrl(key);
    if (!coverUrl) {
      const parent = img.parentElement as HTMLDivElement;
      if (!parent) return;

      const tempate = document.querySelector<HTMLTemplateElement>(
        "template#missing-cover",
      );
      if (!tempate) return;
      const missingIcon = tempate?.content.cloneNode(true) as
        | DocumentFragment
        | undefined;
      if (!missingIcon) return;

      img.remove();

      parent.prepend(missingIcon);
      return;
    }

    img.src = coverUrl;
    img.onload = () => img.classList.replace("opacity-0", "opacity-100");
  }),
);
