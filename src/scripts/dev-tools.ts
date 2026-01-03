import { pb } from "@scripts/db";

async function initializeSorting() {
  const galleries = [
    "gallery.oil",
    "gallery.watercolor",
    "gallery.pastel",
    "gallery.graphics",
  ];
  let totalUpdated = 0;

  for (const galleryKey of galleries) {
    const images = await pb.collection("image").getFullList({
      filter: `key="${galleryKey}"`,
      sort: "created",
    });
    console.log(images);

    if (images.length === 0) continue;

    for (let i = 0; i < images.length; i++) {
      await pb.collection("image").update(images[i].id, { sorting: i });
    }

    totalUpdated += images.length;
  }

  return totalUpdated;
}

document
  .getElementById("init-sorting-btn")
  ?.addEventListener("click", async () => {
    const btn = document.getElementById(
      "init-sorting-btn",
    ) as HTMLButtonElement;
    const result = document.getElementById("result") as HTMLDivElement;

    btn.disabled = true;
    btn.textContent = "Initializing...";

    try {
      const count = await initializeSorting();
      result.className = "mt-4 alert alert-success";
      result.textContent = `✓ Updated ${count} images`;
      result.classList.remove("hidden");
      btn.textContent = "Complete!";
    } catch (error) {
      result.className = "mt-4 alert alert-error";
      result.textContent = `✗ Error: ${error}`;
      result.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = "Initialize Image Sorting";
    }
  });
