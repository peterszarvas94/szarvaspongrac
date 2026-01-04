import { getImageUrls, deleteImage, setCoverImage, swapImageOrder } from './db.C5WFIfDw.js';
import { showAlert, getEditMode } from './ProseLayout.astro_astro_type_script_index_0_lang.CFo0LeZd.js';
import { confirm } from './confirm-dialog.CNJzHFJm.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.Bcz9BLLz.js';

function getGallery() {
  return document.querySelector("[data-images]");
}
function getTemplate() {
  return document.querySelector(
    "template#image-gallery-item"
  );
}
function getWrapper(id) {
  return getGallery()?.querySelector(`div[data-id="${id}"]`);
}
function removeButtonsFromWrapper(wrapper) {
  wrapper.querySelector("button[data-delete]")?.remove();
  wrapper.querySelector("button[data-cover]")?.remove();
}
function addButtonsToWrapper(wrapper) {
  const id = wrapper.dataset.id;
  const template = getTemplate();
  const authDiv = wrapper.querySelector("div[data-auth]");
  if (!id || !template || !authDiv) return;
  const templateContent = template.content.cloneNode(true);
  const deleteBtn = templateContent.querySelector(
    "button[data-delete]"
  );
  if (deleteBtn) {
    deleteBtn.dataset.delete = id;
    if (getEditMode()) deleteBtn.classList.remove("hidden");
    authDiv.appendChild(deleteBtn);
    initDeleteButton(deleteBtn);
  }
  const coverBtn = templateContent.querySelector("button[data-cover]");
  if (coverBtn) {
    coverBtn.dataset.cover = id;
    if (getEditMode()) coverBtn.classList.remove("hidden");
    authDiv.appendChild(coverBtn);
    initCoverButton(coverBtn);
  }
}
function updateCoverUI(oldCoverId, newCoverId) {
  if (oldCoverId) {
    const oldWrapper = getWrapper(oldCoverId);
    if (oldWrapper) addButtonsToWrapper(oldWrapper);
  }
  const newWrapper = getWrapper(newCoverId);
  if (newWrapper) removeButtonsFromWrapper(newWrapper);
}
function initDeleteButton(button) {
  const id = button.dataset.delete;
  if (!id) return;
  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmed = await confirm({
      title: "Kép törlése",
      message: "Biztosan törölni szeretnéd ezt a képet? Nem vonható vissza!",
      confirmText: "Törlés",
      cancelText: "Mégse"
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
function initCoverButton(button) {
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
      cancelText: "Mégse"
    });
    if (!confirmed) return;
    const wrappers = gallery.querySelectorAll("div[data-id]");
    let foundOldCoverId = null;
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
function initMoveUpButton(button) {
  const gallery = getGallery();
  if (!gallery) return;
  const id = button.dataset.moveUp;
  if (!id) return;
  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const wrapper = getWrapper(id);
    if (!wrapper) return;
    const wrappers = Array.from(
      gallery.querySelectorAll("div[data-id]")
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
function initMoveDownButton(button) {
  const gallery = getGallery();
  if (!gallery) return;
  const id = button.dataset.moveDown;
  if (!id) return;
  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const wrapper = getWrapper(id);
    if (!wrapper) return;
    const wrappers = Array.from(
      gallery.querySelectorAll("div[data-id]")
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
  const wrappers = gallery.querySelectorAll("div[data-id]");
  wrappers.forEach((w, index) => {
    w.dataset.sorting = String(index + 1);
  });
}
function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll("[data-delete]");
  deleteButtons.forEach((button) => initDeleteButton(button));
}
function initCoverButtons() {
  const coverButtons = document.querySelectorAll("[data-cover]");
  coverButtons.forEach((button) => initCoverButton(button));
}
function initMoveButtons() {
  const moveUpButtons = document.querySelectorAll("[data-move-up]");
  moveUpButtons.forEach((button) => initMoveUpButton(button));
  const moveDownButtons = document.querySelectorAll("[data-move-down]");
  moveDownButtons.forEach((button) => initMoveDownButton(button));
}
async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.sort((a, b) => a.sorting - b.sorting);
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const isFirst = i === 0;
    const isLast = i === images.length - 1;
    const element = template.content.cloneNode(true);
    const wrapper = element.firstElementChild;
    if (!wrapper) continue;
    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.id = image.id;
    const img = wrapper.querySelector("img");
    img?.setAttribute("src", image.url);
    const deleteButton = wrapper.querySelector(
      "button[data-delete]"
    );
    deleteButton?.setAttribute("data-delete", image.id);
    if (image.cover) deleteButton?.remove();
    const coverButton = wrapper.querySelector("button[data-cover]");
    coverButton?.setAttribute("data-cover", image.id);
    if (image.cover) coverButton?.remove();
    const moveUpButton = wrapper.querySelector(
      "button[data-move-up]"
    );
    if (isFirst) {
      moveUpButton?.remove();
    } else {
      moveUpButton?.setAttribute("data-move-up", image.id);
    }
    const moveDownButton = wrapper.querySelector(
      "button[data-move-down]"
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
  const popover = document.getElementById("image-popover");
  if (!popover) return;
  const popoverImg = popover.querySelector("img");
  const buttons = document.querySelectorAll(
    "button[commandfor='image-popover']"
  );
  buttons.forEach(
    (button) => button.addEventListener("click", () => {
      const url = button.querySelector("img")?.getAttribute("src") || "";
      popoverImg?.setAttribute("src", url);
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openPopover = document.querySelector(
        "[popover]:popover-open"
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
