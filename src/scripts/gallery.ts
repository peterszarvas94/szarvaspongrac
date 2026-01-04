import {
  deleteImage,
  getImageUrls,
  setCoverImage,
  reorderImages,
} from "@scripts/db";
import { showAlert } from "./toaster";
import { getEditMode } from "./edit";
import { confirm } from "./confirm-dialog";

function getGallery() {
  return document.querySelector<HTMLDivElement>("[data-images]");
}

function getTemplate() {
  return document.querySelector<HTMLTemplateElement>(
    "template#image-gallery-item",
  );
}

function getWrapper(id: string) {
  return getGallery()?.querySelector<HTMLDivElement>(`div[data-id="${id}"]`);
}

function removeButtonsFromWrapper(wrapper: HTMLDivElement) {
  wrapper.querySelector<HTMLButtonElement>("button[data-delete]")?.remove();
  wrapper.querySelector<HTMLButtonElement>("button[data-cover]")?.remove();
}

function addButtonsToWrapper(wrapper: HTMLDivElement) {
  const id = wrapper.dataset.id;
  const template = getTemplate();
  const authDiv = wrapper.querySelector("div[data-auth]");
  if (!id || !template || !authDiv) return;

  const templateContent = template.content.cloneNode(true) as DocumentFragment;

  const deleteBtn = templateContent.querySelector<HTMLButtonElement>(
    "button[data-delete]",
  );
  if (deleteBtn) {
    deleteBtn.dataset.delete = id;
    if (getEditMode()) deleteBtn.classList.remove("hidden");
    authDiv.appendChild(deleteBtn);
    initDeleteButton(deleteBtn);
  }

  const coverBtn =
    templateContent.querySelector<HTMLButtonElement>("button[data-cover]");
  if (coverBtn) {
    coverBtn.dataset.cover = id;
    if (getEditMode()) coverBtn.classList.remove("hidden");
    authDiv.appendChild(coverBtn);
    initCoverButton(coverBtn);
  }
}

function updateCoverUI(oldCoverId: string | null, newCoverId: string) {
  if (oldCoverId) {
    const oldWrapper = getWrapper(oldCoverId);
    if (oldWrapper) addButtonsToWrapper(oldWrapper);
  }

  const newWrapper = getWrapper(newCoverId);
  if (newWrapper) removeButtonsFromWrapper(newWrapper);
}

function initDeleteButton(button: HTMLButtonElement) {
  const id = button.dataset.delete;
  if (!id) return;

  button.addEventListener("click", async () => {
    const confirmed = await confirm({
      title: "Kép törlése",
      message: "Biztosan törölni szeretnéd ezt a képet? Nem vonható vissza!",
      confirmText: "Törlés",
      cancelText: "Mégse",
    });
    if (!confirmed) return;

    try {
      await deleteImage(id);
      showAlert("Törölve", "success");
      getWrapper(id)?.remove();
    } catch (error) {
      showAlert("Nem sikerült törölni a képet", "error");
      console.error({ msg: "Error deleting the image", id, error });
    }
  });
}

function initCoverButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const key = gallery.dataset.images ?? "";
  const id = button.dataset.cover;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmed = await confirm({
      title: "Borítókép beállítása",
      message: "Ezt a képet állítod be borítóképnek?",
      confirmText: "Beállítás",
      cancelText: "Mégse",
    });
    if (!confirmed) return;

    const oldCoverId =
      gallery.querySelector<HTMLDivElement>(
        "div[data-id]:has(button[data-delete]:not([data-delete]))",
      )?.dataset.id ?? null;

    // Find old cover by checking which wrapper has no buttons
    const wrappers = gallery.querySelectorAll<HTMLDivElement>("div[data-id]");
    let foundOldCoverId: string | null = null;
    for (const w of wrappers) {
      const hasDeleteBtn = w.querySelector("button[data-delete]");
      const hasCoverBtn = w.querySelector("button[data-cover]");
      if (!hasDeleteBtn && !hasCoverBtn && w.dataset.id) {
        foundOldCoverId = w.dataset.id;
        break;
      }
    }

    try {
      await setCoverImage(id, key);
      updateCoverUI(foundOldCoverId, id);
      showAlert("Borítókép beállítva", "success");
    } catch (error) {
      showAlert("Nem sikerült beállítani a borítóképet", "error");
      console.error({ msg: "Error setting cover image", id, error });
    }
  });
}

function initDeleteButtons() {
  const deleteButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-delete]");
  deleteButtons.forEach((button) => initDeleteButton(button));
}

function initCoverButtons() {
  const coverButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-cover]");
  coverButtons.forEach((button) => initCoverButton(button));
}

async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;

  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);

  // Sort images by sorting field
  images.sort((a, b) => a.sorting - b.sorting);

  for (const image of images) {
    const element = template.content.cloneNode(true) as DocumentFragment;
    const wrapper = element.firstElementChild as HTMLDivElement | null;
    if (!wrapper) continue;

    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.id = image.id;

    // Set draggable attribute based on edit mode
    if (getEditMode()) {
      wrapper.setAttribute("draggable", "true");
      wrapper.style.cursor = "move";
    }

    const img = wrapper.querySelector("img");
    img?.setAttribute("src", image.url);

    const deleteButton = wrapper.querySelector<HTMLButtonElement>(
      "button[data-delete]",
    );
    deleteButton?.setAttribute("data-delete", image.id);
    if (image.cover) deleteButton?.remove();

    const coverButton =
      wrapper.querySelector<HTMLButtonElement>("button[data-cover]");
    coverButton?.setAttribute("data-cover", image.id);
    if (image.cover) coverButton?.remove();

    gallery.appendChild(wrapper);
  }
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

let draggedItemId: string | null = null;

function addDragListeners(wrapper: HTMLDivElement) {
  const gallery = getGallery();
  const id = wrapper.dataset.id;
  if (!id || !gallery) return;

  // Prevent duplicate listeners
  if (wrapper.dataset.dragListeners === "true") return;
  wrapper.dataset.dragListeners = "true";

  wrapper.addEventListener("dragstart", (e) => {
    if (!getEditMode()) return;
    draggedItemId = id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    }
    wrapper.style.opacity = "0.5";
  });

  wrapper.addEventListener("dragend", () => {
    wrapper.style.opacity = "1";
    draggedItemId = null;

    // Clean up any remaining visual indicators
    const allWrappers =
      gallery?.querySelectorAll<HTMLDivElement>("div[data-id]");
    allWrappers?.forEach((w) => {
      w.style.boxShadow = "";
    });
  });

  wrapper.addEventListener("dragover", (e) => {
    if (!getEditMode() || !draggedItemId) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";

    // Add visual drop indicator
    wrapper.style.boxShadow = "0 4px 0 0 #3b82f6";
    wrapper.style.transition = "box-shadow 0.2s ease";
  });

  wrapper.addEventListener("dragleave", (e) => {
    if (!getEditMode() || !draggedItemId) return;

    // Remove visual drop indicator
    wrapper.style.boxShadow = "";
  });

  wrapper.addEventListener("drop", async (e) => {
    if (!getEditMode() || !draggedItemId || !gallery) return;
    e.preventDefault();

    // Clean up visual indicator
    wrapper.style.boxShadow = "";

    const targetId = wrapper.dataset.id;
    if (!targetId || targetId === draggedItemId) return;

    try {
      // Get current items from DOM
      const wrappers = gallery.querySelectorAll<HTMLDivElement>("div[data-id]");
      const items = Array.from(wrappers).map((w) => ({
        id: w.dataset.id!,
        sorting: parseInt(w.dataset.sorting!) || 0,
      }));

      // Find the dragged and target DOM elements
      const draggedElement = gallery.querySelector<HTMLDivElement>(
        `div[data-id="${draggedItemId}"]`,
      );
      const targetElement = wrapper;

      if (!draggedElement || !targetElement) return;

      // Move the DOM node immediately for smooth UX
      // Insert dragged element after target element
      targetElement.insertAdjacentElement("afterend", draggedElement);

      // Update database in background
      await reorderImages(draggedItemId, targetId, items);
      showAlert("Sorrend frissítve", "success");

      // Update the sorting data attributes to reflect new order
      const updatedWrappers =
        gallery.querySelectorAll<HTMLDivElement>("div[data-id]");
      updatedWrappers.forEach((w, index) => {
        w.dataset.sorting = String(index + 1);
      });
    } catch (error) {
      showAlert("Nem sikerült frissíteni a sorrendet", "error");
      console.error("Error reordering images:", error);

      // If database update failed, refresh to restore correct order
      gallery.innerHTML = "";
      await initGallery();
      initDeleteButtons();
      initCoverButtons();
      initDragAndDrop();
    }
  });
}

function initDragAndDrop() {
  const gallery = getGallery();
  if (!gallery) return;

  // Add drag listeners to existing items
  const wrappers = gallery.querySelectorAll<HTMLDivElement>("div[data-id]");
  wrappers.forEach(addDragListeners);
}

await initGallery();
initDeleteButtons();
initCoverButtons();
initPopover();
initDragAndDrop();
