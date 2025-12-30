import { deleteImage, getImageUrls } from "@lib/db";

async function initGallery() {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  const imageTemplate = document.querySelector<HTMLTemplateElement>(
    "template#image-gallery-item",
  );
  if (!gallery || !imageTemplate) return;

  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);

  images.forEach((image) => {
    const element = imageTemplate.content.cloneNode(true) as DocumentFragment;
    const img = element.querySelector("img");
    if (img) img.setAttribute("src", image.url);

    const deleteButton = element.querySelector<HTMLButtonElement>(
      "button[data-delete]",
    );
    if (deleteButton) deleteButton.setAttribute("data-delete", image.id);

    gallery.appendChild(element);
  });
}

export function initDeleteButtons() {
  const deleteButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-delete]");

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
      if (!confirmed) return;

      try {
        await deleteImage(id);
        window.alert("Törölve");
        window.location.reload();
      } catch (error) {
        window.alert("Nem sikerült törölni a képet");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  });
}

function initPopover() {
  const popover = document.getElementById("image-popover") as HTMLDivElement;
  if (!popover) return;

  const popoverImg = popover.querySelector("img");
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "button[commandfor='image-popover']",
  );

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const url = button.querySelector("img")?.getAttribute("src") || "";
      popoverImg?.setAttribute("src", url);
    }),
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openPopover = document.querySelector<HTMLElement>(
        "[popover]:popover-open",
      );
      if (openPopover) {
        openPopover.hidePopover();
      }
    }
  });
}

async function init() {
  await initGallery();
  initDeleteButtons();
  initPopover();
}

init();
document.addEventListener("astro:page-load", init);
