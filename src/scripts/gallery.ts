import {
  deleteImage,
  getImageUrls,
  setCoverImage,
  swapImageOrder,
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

  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();

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

function initMoveUpButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const id = button.dataset.moveUp;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    // Get all wrappers and find current position
    const wrappers = Array.from(
      gallery.querySelectorAll<HTMLDivElement>("div[data-id]"),
    );
    const currentIndex = wrappers.indexOf(wrapper);
    if (currentIndex <= 0) return;

    const prevWrapper = wrappers[currentIndex - 1];
    const prevId = prevWrapper.dataset.id;
    if (!prevId) return;

    try {
      await swapImageOrder(id, prevId);
      prevWrapper.insertAdjacentElement("beforebegin", wrapper);
      updateSortingAttributes();
      showAlert("Áthelyezve", "success");
    } catch (error) {
      showAlert("Nem sikerült áthelyezni", "error");
      console.error({ msg: "Error moving image up", id, error });
    }
  });
}

function initMoveDownButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const id = button.dataset.moveDown;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    // Get all wrappers and find current position
    const wrappers = Array.from(
      gallery.querySelectorAll<HTMLDivElement>("div[data-id]"),
    );
    const currentIndex = wrappers.indexOf(wrapper);
    if (currentIndex >= wrappers.length - 1) return;

    const nextWrapper = wrappers[currentIndex + 1];
    const nextId = nextWrapper.dataset.id;
    if (!nextId) return;

    try {
      await swapImageOrder(id, nextId);
      nextWrapper.insertAdjacentElement("afterend", wrapper);
      updateSortingAttributes();
      showAlert("Áthelyezve", "success");
    } catch (error) {
      showAlert("Nem sikerült áthelyezni", "error");
      console.error({ msg: "Error moving image down", id, error });
    }
  });
}

function updateSortingAttributes() {
  const gallery = getGallery();
  if (!gallery) return;

  const wrappers = gallery.querySelectorAll<HTMLDivElement>("div[data-id]");
  wrappers.forEach((w, index) => {
    w.dataset.sorting = String(index + 1);
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

function initMoveButtons() {
  const moveUpButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-move-up]");
  moveUpButtons.forEach((button) => initMoveUpButton(button));

  const moveDownButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-move-down]");
  moveDownButtons.forEach((button) => initMoveDownButton(button));
}

async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;

  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);

  // Sort images by sorting field
  images.sort((a, b) => a.sorting - b.sorting);

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const isFirst = i === 0;
    const isLast = i === images.length - 1;

    const element = template.content.cloneNode(true) as DocumentFragment;
    const wrapper = element.firstElementChild as HTMLDivElement | null;
    if (!wrapper) continue;

    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.id = image.id;

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

    const moveUpButton = wrapper.querySelector<HTMLButtonElement>(
      "button[data-move-up]",
    );
    if (isFirst) {
      moveUpButton?.remove();
    } else {
      moveUpButton?.setAttribute("data-move-up", image.id);
    }

    const moveDownButton = wrapper.querySelector<HTMLButtonElement>(
      "button[data-move-down]",
    );
    if (isLast) {
      moveDownButton?.remove();
    } else {
      moveDownButton?.setAttribute("data-move-down", image.id);
    }

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

await initGallery();
initDeleteButtons();
initCoverButtons();
initMoveButtons();
initPopover();
