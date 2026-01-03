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

    // Each gallery starts from 0, increments by 1: 0, 1, 2, 3...
    const updates = images.map((image, index) =>
      pb.collection("image").update(image.id, { sorting: index }),
    );

    await Promise.all(updates);
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
