import PocketBase from "pocketbase";
import { PB_URL } from "env";
import { updateElements } from "auth";

const pb = new PocketBase(PB_URL);

/** @param {string} key */
async function getImageUrls(key) {
  try {
    const images = await pb
      .collection("image")
      .getFullList({ filter: `key="${key}"` });

    return images.map((record) => ({
      id: record.id,
      url: pb.files.getURL(record, record.file),
      filename: record.file,
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

async function initImages() {
  const gallery = /**@type {HTMLDivElement}*/ (
    document.querySelector("[data-images]")
  );
  const imageTemplate = /**@type {HTMLTemplateElement}*/ (
    document.querySelector("template#image-gallery-item")
  );
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.forEach((image) => {
    const element = /** @type {DocumentFragment} */ (
      imageTemplate.content.cloneNode(true)
    );
    const img = /** @type {HTMLImageElement} */ (element.querySelector("img"));
    img.setAttribute("src", image.url);

    const deleteButton = /** @type {HTMLButtonElement}*/ (
      element.querySelector("button[data-delete]")
    );
    deleteButton.setAttribute("data-delete", image.id);

    gallery.appendChild(element);
  });

  updateElements();
}

function initDeleteButtons() {
  /** @type {NodeListOf<HTMLButtonElement>} */
  const deleteButtons = document.querySelectorAll("[data-delete]");

  Array.from(deleteButtons).forEach((button) => {
    const id = button.dataset.delete;
    if (!id) {
      console.error("No image id for button", button);
      return;
    }
    button.addEventListener("click", async () => {
      const confirmed = window.confirm(
        "Törlöd ezt a képet? Nem vonható vissza!",
      );
      if (!confirmed) {
        return;
      }

      try {
        await pb.collection("image").delete(id);
        window.alert("Törölve");
        // NOTE: should remove manually, not reload
        window.location.reload();
      } catch (error) {
        window.alert("Nem sikerült törölni a képet");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  });
}

async function updateAll() {
  await initImages();
  initDeleteButtons();
}

export async function init() {
  await updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

await init();
