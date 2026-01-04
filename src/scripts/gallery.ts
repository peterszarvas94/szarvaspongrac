import {
  deleteImage,
  getCoverImage,
  getImageUrls,
  setCoverImage,
  swapImageOrder,
} from "@scripts/db";
import { showAlert } from "@scripts/toaster";
import { updateEditUI } from "@scripts/edit";
import { confirm } from "@scripts/confirm-dialog";

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
    } catch {
      showAlert("Nem sikerült törölni a képet", "error");
    }
  });
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

function initCoverButton(button: HTMLButtonElement, isCurrentCover: boolean) {
  const gallery = getGallery();
  if (!gallery) return;

  const key = gallery.dataset.images ?? "";
  const id = button.dataset.cover;
  if (!id) return;

  if (isCurrentCover) {
    hideButtons(id);
  }

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = getWrapper(id);
    if (!wrapper) return;

    const confirmed = await confirm({
      title: "Borítókép beállítása",
      message: "Ezt a képet állítod be borítóképnek?",
      confirmText: "Beállítás",
      cancelText: "Mégse",
    });
    if (!confirmed) return;

    try {
      const { id: oldCoverId } = await setCoverImage(id, key);
      hideButtons(id);
      showButtons(oldCoverId);
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

async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;

  const key = gallery.dataset.images;
  if (!key) return;

  const images = await getImageUrls(key);
  images.sort((a, b) => a.sorting - b.sorting);

  const currentCover = await getCoverImage(key);
  console.log({ currentCover });

  images.forEach((image) => {
    const frag = template.content.cloneNode(true) as DocumentFragment;
    const wrapper = frag.firstElementChild as HTMLDivElement;

    wrapper.dataset.id = image.id;
    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.cover = image.cover ? "true" : "false";

    const img = wrapper.querySelector<HTMLImageElement>("img");
    if (!img) return;

    img.setAttribute("src", image.url);

    const popoverBtn = wrapper.querySelector<HTMLButtonElement>(
      "[commandfor=image-popover]",
    );
    if (!popoverBtn) return;

    const deleteBtn = wrapper.querySelector<HTMLButtonElement>("[data-delete]");
    if (!deleteBtn) return;

    const coverBtn = wrapper.querySelector<HTMLButtonElement>("[data-cover]");
    if (!coverBtn) return;

    const upBtn = wrapper.querySelector<HTMLButtonElement>("[data-move-up]");
    if (!upBtn) return;

    const downBtn =
      wrapper.querySelector<HTMLButtonElement>("[data-move-down]");
    if (!downBtn) return;

    popoverBtn.dataset.url = image.url;
    deleteBtn.dataset.delete = image.id;
    coverBtn.dataset.cover = image.id;
    upBtn.dataset.moveUp = image.id;
    downBtn.dataset.moveDown = image.id;

    updateEditUI();

    initDeleteButton(deleteBtn);
    // TODO: this kind of works after you change 2, but not before 2 changes
    initCoverButton(coverBtn, currentCover.id === image.id);
    initMoveUpButton(upBtn);
    initMoveDownButton(downBtn);
    initPopoverButton(popoverBtn);

    gallery.appendChild(wrapper);
  });
}

function initPopoverButton(popoverBtn: HTMLButtonElement) {
  const popover = getPopover();
  if (!popover) return;

  const popoverImg = popover.querySelector<HTMLImageElement>("img");
  if (!popoverImg) return;

  const url = popoverBtn.dataset.url;
  if (!url) return;

  popoverImg.setAttribute("src", url);
}

await initGallery();
