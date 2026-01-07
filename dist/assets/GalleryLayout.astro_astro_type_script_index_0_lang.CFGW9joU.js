import { getImageUrls, deleteImage, setCoverImage, swapImageOrder } from './db.DZiNoy5o.js';
import { updateEditUI, showAlert } from './ProseLayout.astro_astro_type_script_index_0_lang.DzFQzbr_.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.CnKQR-uk.js';

function confirm(options) {
  return new Promise((resolve) => {
    const dialog = document.getElementById("confirm-dialog");
    const title = document.getElementById("confirm-dialog-title");
    const message = document.getElementById("confirm-dialog-message");
    const confirmBtn = document.getElementById("confirm-dialog-confirm");
    const cancelBtn = document.getElementById("confirm-dialog-cancel");
    if (!dialog || !title || !message || !confirmBtn || !cancelBtn) {
      console.error("Confirm dialog elements not found");
      resolve(false);
      return;
    }
    if (options.title) {
      title.textContent = options.title;
    }
    message.textContent = options.message;
    if (options.confirmText) {
      confirmBtn.textContent = options.confirmText;
    }
    if (options.cancelText) {
      cancelBtn.textContent = options.cancelText;
    }
    const handleConfirm = () => {
      dialog.hidePopover();
      cleanup();
      resolve(true);
    };
    const handleCancel = () => {
      dialog.hidePopover();
      cleanup();
      resolve(false);
    };
    const handleToggle = (e) => {
      const toggleEvent = e;
      if (toggleEvent.newState === "closed") {
        cleanup();
        resolve(false);
      }
    };
    const cleanup = () => {
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
      dialog.removeEventListener("toggle", handleToggle);
    };
    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);
    dialog.addEventListener("toggle", handleToggle);
    dialog.showPopover();
  });
}

function getPopover() {
  return document.querySelector("#image-popover");
}
function getGallery() {
  return document.querySelector("[data-images]");
}
function getTemplate() {
  return document.querySelector(
    "template#image-gallery-item"
  );
}
function getWrapper(id) {
  return getWrappers().find((wrapper) => wrapper.dataset.id === id);
}
function getWrappers() {
  const gallery = getGallery();
  if (!gallery) return [];
  const wrappers = gallery.querySelectorAll("[data-id]");
  return Array.from(wrappers);
}
function initDeleteButton(button) {
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
      cancelText: "Mégse"
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
function showButtons(id) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;
  const coverBtn = wrapper.querySelector("button[data-cover]");
  if (!coverBtn) return;
  const deleteBtn = wrapper.querySelector(
    "button[data-delete]"
  );
  if (!deleteBtn) return;
  coverBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
}
function hideButtons(id) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;
  const coverBtn = wrapper.querySelector("button[data-cover]");
  if (!coverBtn) return;
  const deleteBtn = wrapper.querySelector(
    "button[data-delete]"
  );
  if (!deleteBtn) return;
  coverBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
}
function hideCurrentCoverButtons() {
  const wrappers = getWrappers();
  const currentCoverWrapper = wrappers.find(
    (wrapper) => wrapper.dataset.cover === "true"
  );
  if (!currentCoverWrapper?.dataset.id) return;
  hideButtons(currentCoverWrapper.dataset.id);
}
function initCoverButton(button) {
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
    if (wrapper.dataset.cover === "true") return;
    const confirmed = await confirm({
      title: "Borítókép beállítása",
      message: "Ezt a képet állítod be borítóképnek?",
      confirmText: "Beállítás",
      cancelText: "Mégse"
    });
    if (!confirmed) return;
    try {
      const oldCover = await setCoverImage(id, key);
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
function initMoveUpButton(button) {
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
      (wrapper2) => wrapper2.dataset.id === id
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
function initMoveDownButton(button) {
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
      (wrapper2) => wrapper2.dataset.id === id
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
function appendImage({
  id,
  url,
  sorting,
  cover = false
}) {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;
  const frag = template.content.cloneNode(true);
  const wrapper = frag.firstElementChild;
  wrapper.dataset.id = id;
  wrapper.dataset.sorting = String(sorting);
  wrapper.dataset.cover = cover ? "true" : "false";
  const img = wrapper.querySelector("img");
  if (!img) return;
  img.setAttribute("src", url);
  const popoverBtn = wrapper.querySelector(
    "[commandfor=image-popover]"
  );
  if (popoverBtn) popoverBtn.dataset.url = url;
  const deleteBtn = wrapper.querySelector("[data-delete]");
  if (deleteBtn) deleteBtn.dataset.delete = id;
  const coverBtn = wrapper.querySelector("[data-cover]");
  if (coverBtn) coverBtn.dataset.cover = id;
  const upBtn = wrapper.querySelector("[data-move-up]");
  if (upBtn) upBtn.dataset.moveUp = id;
  const downBtn = wrapper.querySelector("[data-move-down]");
  if (downBtn) downBtn.dataset.moveDown = id;
  gallery.appendChild(wrapper);
  initImageButtons(id);
  updateEditUI();
}
function hideEmptyGalleryText() {
  const div = document.querySelector("div#empty-gallery");
  if (!div) return;
  div.remove();
}
function showEmptyGalleryText() {
  const gallery = getGallery();
  if (!gallery) return;
  const template = document.querySelector(
    "template#empty-gallery-template"
  );
  if (!template) return;
  const fragment = template.content.cloneNode(true);
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
      cover: image.cover
    });
  });
  hideCurrentCoverButtons();
}
function initPopoverButton(popoverBtn) {
  const popover = getPopover();
  if (!popover) return;
  const popoverImg = popover.querySelector("img");
  if (!popoverImg) return;
  const url = popoverBtn.dataset.url;
  if (!url) return;
  popoverImg.setAttribute("src", url);
}
function initImageButtons(id) {
  const wrapper = getWrapper(id);
  if (!wrapper) return;
  const deleteBtn = wrapper.querySelector("[data-delete]");
  if (deleteBtn) initDeleteButton(deleteBtn);
  const coverBtn = wrapper.querySelector("[data-cover]");
  if (coverBtn) initCoverButton(coverBtn);
  const upBtn = wrapper.querySelector("[data-move-up]");
  if (upBtn) initMoveUpButton(upBtn);
  const downBtn = wrapper.querySelector("[data-move-down]");
  if (downBtn) initMoveDownButton(downBtn);
  const popoverBtn = wrapper.querySelector(
    "[commandfor=image-popover]"
  );
  if (popoverBtn) initPopoverButton(popoverBtn);
}
await initGallery();

export { appendImage, hideEmptyGalleryText };
