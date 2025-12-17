import { deleteImage, getImageUrls } from "db";

async function initGallery() {
  const gallery = /**@type {HTMLDivElement}*/ (
    document.querySelector("[data-images]")
  );
  const imageTemplate = /** @type {HTMLTemplateElement} */ (
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
}

export function initDeleteButtons() {
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
        await deleteImage(id);
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

function initPopover() {
  const popover = /** @type {HTMLDivElement}*/ (
    document.getElementById("image-popover")
  );
  const popoverImg = popover.querySelector("img");

  const buttons = /** @type {NodeListOf<HTMLButtonElement>} */ (
    document.querySelectorAll("button[commandfor='image-popover']")
  );

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const url = button.querySelector("img")?.getAttribute("src") || "";
      popoverImg?.setAttribute("src", url);
    }),
  );
}

async function init() {
  await initGallery();
  initDeleteButtons();
  initPopover();
}

await init();
document.addEventListener("astro:page-load", init);
