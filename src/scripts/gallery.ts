import { deleteImage, getImageUrls, setCoverImage } from "@scripts/db";
import { showAlert } from "./toaster";
import { EditModeEvent, getEditMode } from "./edit";

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
    if (img) {
      img.setAttribute("src", image.url);
      // Mark as cover image with data attribute for later reference
      if (image.cover) {
        img.setAttribute("data-cover-image", "true");
        // Only add ring if in edit mode
        if (getEditMode()) {
          img.classList.add("ring-2", "ring-offset-1", "ring-warning");
        }
      }
    }

    const deleteButton = element.querySelector<HTMLButtonElement>(
      "button[data-delete]",
    );
    if (deleteButton) {
      deleteButton.setAttribute("data-delete", image.id);
      // Hide delete button if this is the cover image
      if (image.cover) {
        deleteButton.remove();
      }
    }

    const coverButton =
      element.querySelector<HTMLButtonElement>("button[data-cover]");
    if (coverButton) {
      coverButton.setAttribute("data-cover", image.id);
      // Hide cover button if this is already the cover image
      if (image.cover) {
        coverButton.remove();
      }
    }

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
        showAlert("Törölve", "success");
        window.location.reload();
      } catch (error) {
        showAlert("Nem sikerült törölni a képet", "error");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  });
}

export function initCoverButtons() {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  if (!gallery) return;

  const key = gallery.dataset.images ?? "";
  const coverButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-cover]");

  Array.from(coverButtons).forEach((button) => {
    const id = button.dataset.cover;
    if (!id) {
      console.error("No image id for button", button);
      return;
    }
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const confirmed = window.confirm("Ezt a képet állítod be borítóképnek?");
      if (!confirmed) return;

      try {
        await setCoverImage(id, key);
        showAlert("Borítókép beállítva", "success");
        window.location.reload();
      } catch (error) {
        showAlert("Nem sikerült beállítani a borítóképet", "error");
        console.error({ msg: "Error setting cover image", id, error });
      }
    });
  });
}

function updateCoverRings() {
  const coverImages = document.querySelectorAll<HTMLImageElement>(
    "#image-gallery img[data-cover-image='true']",
  );
  const isEditMode = getEditMode();

  coverImages.forEach((img) => {
    if (isEditMode) {
      img.classList.add("ring-2", "ring-warning");
    } else {
      img.classList.remove("ring-2", "ring-warning");
    }
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
  initCoverButtons();
  initPopover();

  // Listen for edit mode changes to update cover rings
  window.addEventListener(EditModeEvent.eventName, updateCoverRings);
}

init();
