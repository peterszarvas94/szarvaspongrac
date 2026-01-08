import { confirm } from "@scripts/confirm-dialog";
import {
  deleteImage,
  getImageUrls,
  setCoverImage,
  swapImageOrder,
} from "@scripts/db";
import { updateEditUI } from "@scripts/edit";
import { showAlert } from "@scripts/toaster";

function getPopover() {
  return document.querySelector<HTMLDivElement>("#image-popover");
}

function getGallery() {
  return document.querySelector<HTMLDivElement>("[data-images]");
}

function getTemplate() {
  return document.querySelector<HTMLTemplateElement>(
    "template#image-gallery-item",
  );
}

function getWrapper(id: string) {
  return getWrappers().find((wrapper) => wrapper.dataset.id === id);
}

function getWrappers() {
  const gallery = getGallery();
  if (!gallery) return [];

  const wrappers = gallery.querySelectorAll<HTMLDivElement>("[data-id]");
  return Array.from(wrappers);
}

function initDeleteButton(button: HTMLButtonElement) {
  const id = button.dataset.delete;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    const confirmed = await confirm({
      title: "Kép törlése",
      message: "Biztosan törölni szeretnéd ezt a képet? Nem vonható vissza!",
      confirmText: "Törlés",
      cancelText: "Mégse",
    });
    if (!confirmed) return;

    try {
      await deleteImage(id);
      wrapper.remove();
      showAlert("Törölve", "success");
      checkEmptyGallery();
    } catch {
      showAlert("Nem sikerült törölni a képet", "error");
    }
  });
}

async function checkEmptyGallery() {
  const gallery = getGallery();
  if (!gallery) return;

  const key = gallery.dataset.images;
  if (!key) return;

  const images = await getImageUrls(key);
  if (images.length === 0) {
    showEmptyGalleryText();
  }
}

function showButtons(id: string) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;

  const coverBtn =
    wrapper.querySelector<HTMLButtonElement>("button[data-cover]");
  if (!coverBtn) return;

  const deleteBtn = wrapper.querySelector<HTMLButtonElement>(
    "button[data-delete]",
  );
  if (!deleteBtn) return;

  coverBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
}

function hideButtons(id: string) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;

  const coverBtn =
    wrapper.querySelector<HTMLButtonElement>("button[data-cover]");
  if (!coverBtn) return;

  const deleteBtn = wrapper.querySelector<HTMLButtonElement>(
    "button[data-delete]",
  );
  if (!deleteBtn) return;

  coverBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
}

function hideCurrentCoverButtons() {
  const wrappers = getWrappers();
  const currentCoverWrapper = wrappers.find(
    (wrapper) => wrapper.dataset.cover === "true",
  );
  if (!currentCoverWrapper?.dataset.id) return;
  hideButtons(currentCoverWrapper.dataset.id);
}

function initCoverButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const key = gallery.dataset.images ?? "";
  const id = button.dataset.cover;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    // Skip if already the cover
    if (wrapper.dataset.cover === "true") return;

    const confirmed = await confirm({
      title: "Borítókép beállítása",
      message: "Ezt a képet állítod be borítóképnek?",
      confirmText: "Beállítás",
      cancelText: "Mégse",
    });
    if (!confirmed) return;

    try {
      const oldCover = await setCoverImage(id, key);

      // Update data attributes to track cover state
      const oldWrapper = getWrapper(oldCover.id);
      if (oldWrapper) {
        oldWrapper.dataset.cover = "false";
      }
      wrapper.dataset.cover = "true";

      hideButtons(id);
      showButtons(oldCover.id);
      showAlert("A borítókép sikeresen cserélve", "success");
    } catch {
      showAlert("Nem sikerült beállítani a borítóképet", "error");
    }
  });
}

function initMoveUpButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const id = button.dataset.moveUp;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    const wrappers = getWrappers();
    const currentIndex = wrappers.findIndex(
      (wrapper) => wrapper.dataset.id === id,
    );
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    const prevWrapper = wrappers[prevIndex];
    const prevId = prevWrapper.dataset.id;
    if (!prevId) return;

    await swapImageOrder(id, prevId);
    prevWrapper.insertAdjacentElement("beforebegin", wrapper);

    showAlert("Sorrend frissítve", "success");
  });
}

function initMoveDownButton(button: HTMLButtonElement) {
  const gallery = getGallery();
  if (!gallery) return;

  const id = button.dataset.moveDown;
  if (!id) return;

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    const wrappers = getWrappers();
    const currentIndex = wrappers.findIndex(
      (wrapper) => wrapper.dataset.id === id,
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex >= wrappers.length) return;

    const nextWrapper = wrappers[nextIndex];
    const nextId = nextWrapper.dataset.id;
    if (!nextId) return;

    await swapImageOrder(id, nextId);
    nextWrapper.insertAdjacentElement("afterend", wrapper);

    showAlert("Sorrend frissítve", "success");
  });
}

interface AppendImageOptions {
  id: string;
  url: string;
  sorting: number;
  cover?: boolean;
}

export function appendImage({
  id,
  url,
  sorting,
  cover = false,
}: AppendImageOptions) {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;

  const frag = template.content.cloneNode(true) as DocumentFragment;
  const wrapper = frag.firstElementChild as HTMLDivElement;

  wrapper.dataset.id = id;
  wrapper.dataset.sorting = String(sorting);
  wrapper.dataset.cover = cover ? "true" : "false";

  const img = wrapper.querySelector<HTMLImageElement>("img");
  if (!img) return;

  img.setAttribute("src", url);

  const popoverBtn = wrapper.querySelector<HTMLButtonElement>(
    "[commandfor=image-popover]",
  );
  if (popoverBtn) popoverBtn.dataset.url = url;

  const deleteBtn = wrapper.querySelector<HTMLButtonElement>("[data-delete]");
  if (deleteBtn) deleteBtn.dataset.delete = id;

  const coverBtn = wrapper.querySelector<HTMLButtonElement>("[data-cover]");
  if (coverBtn) coverBtn.dataset.cover = id;

  const upBtn = wrapper.querySelector<HTMLButtonElement>("[data-move-up]");
  if (upBtn) upBtn.dataset.moveUp = id;

  const downBtn = wrapper.querySelector<HTMLButtonElement>("[data-move-down]");
  if (downBtn) downBtn.dataset.moveDown = id;

  gallery.appendChild(wrapper);
  initImageButtons(id);
  updateEditUI();
}

export function hideEmptyGalleryText() {
  const div = document.querySelector<HTMLDivElement>("div#empty-gallery");
  if (!div) return;
  div.remove();
}

export function showEmptyGalleryText() {
  const gallery = getGallery();
  if (!gallery) return;

  const template = document.querySelector<HTMLTemplateElement>(
    "template#empty-gallery-template",
  );
  if (!template) return;

  const fragment = template.content.cloneNode(true) as DocumentFragment;

  gallery.after(fragment);
}

async function initGallery() {
  const gallery = getGallery();
  if (!gallery) return;

  const key = gallery.dataset.images;
  if (!key) return;

  const images = await getImageUrls(key);
  if (images.length === 0) {
    showEmptyGalleryText();
    return;
  }

  images.sort((a, b) => a.sorting - b.sorting);

  images.forEach((image) => {
    appendImage({
      id: image.id,
      url: image.url,
      sorting: image.sorting,
      cover: image.cover,
    });
  });

  hideCurrentCoverButtons();
}

let currentImageIndex = -1;

function getGalleryImageUrls(): string[] {
  const wrappers = getWrappers();
  return wrappers
    .map((w) => w.querySelector<HTMLButtonElement>("[data-url]")?.dataset.url)
    .filter((url): url is string => !!url);
}

function showImageAtIndex(index: number) {
  const urls = getGalleryImageUrls();
  if (index < 0 || index >= urls.length) return;

  const popover = getPopover();
  if (!popover) return;

  const popoverImg = popover.querySelector<HTMLImageElement>("img");
  if (!popoverImg) return;

  currentImageIndex = index;
  popoverImg.setAttribute("src", urls[index]);
}

function showNextImage() {
  const urls = getGalleryImageUrls();
  if (currentImageIndex < urls.length - 1) {
    showImageAtIndex(currentImageIndex + 1);
  }
}

function showPrevImage() {
  if (currentImageIndex > 0) {
    showImageAtIndex(currentImageIndex - 1);
  }
}

function initPopoverNavigation() {
  const popover = getPopover();
  if (!popover) return;

  const prevBtn = document.querySelector<HTMLButtonElement>("#popover-prev");
  const nextBtn = document.querySelector<HTMLButtonElement>("#popover-next");

  prevBtn?.addEventListener("click", showPrevImage);
  nextBtn?.addEventListener("click", showNextImage);

  document.addEventListener("keydown", (e) => {
    if (!popover.matches(":popover-open")) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      showNextImage();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPrevImage();
    }
  });
}

function initPopoverButton(popoverBtn: HTMLButtonElement) {
  popoverBtn.addEventListener("click", () => {
    const urls = getGalleryImageUrls();
    const url = popoverBtn.dataset.url;
    if (!url) return;

    currentImageIndex = urls.indexOf(url);
    showImageAtIndex(currentImageIndex);
  });
}

initPopoverNavigation();

export function initImageButtons(id: string) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;

  const deleteBtn = wrapper.querySelector<HTMLButtonElement>("[data-delete]");
  if (deleteBtn) initDeleteButton(deleteBtn);

  const coverBtn = wrapper.querySelector<HTMLButtonElement>("[data-cover]");
  if (coverBtn) initCoverButton(coverBtn);

  const upBtn = wrapper.querySelector<HTMLButtonElement>("[data-move-up]");
  if (upBtn) initMoveUpButton(upBtn);

  const downBtn = wrapper.querySelector<HTMLButtonElement>("[data-move-down]");
  if (downBtn) initMoveDownButton(downBtn);

  const popoverBtn = wrapper.querySelector<HTMLButtonElement>(
    "[commandfor=image-popover]",
  );
  if (popoverBtn) initPopoverButton(popoverBtn);
}

await initGallery();
