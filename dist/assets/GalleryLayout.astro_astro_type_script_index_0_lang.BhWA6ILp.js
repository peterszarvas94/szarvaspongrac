import { getImageUrls, deleteImage, setCoverImage, swapImageOrder } from './db.C5WFIfDw.js';
import { getEditMode, showAlert } from './ProseLayout.astro_astro_type_script_index_0_lang.BTwIcViZ.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.Bcz9BLLz.js';

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
function updateGalleryButtons() {
  const gallery = getGallery();
  if (!gallery) return;
  const wrappers = Array.from(
    gallery.querySelectorAll("div[data-id]")
  );
  wrappers.forEach((wrapper, index) => {
    const isFirst = index === 0;
    const isLast = index === wrappers.length - 1;
    const isCover = wrapper.dataset.cover === "true";
    const moveUp = wrapper.querySelector("[data-move-up]");
    const moveDown = wrapper.querySelector("[data-move-down]");
    const cover = wrapper.querySelector("[data-cover]");
    const del = wrapper.querySelector("[data-delete]");
    if (isFirst) moveUp?.remove();
    else moveUp?.classList.remove("hidden");
    if (isLast) moveDown?.remove();
    else moveDown?.classList.remove("hidden");
    if (isCover) {
      cover?.remove();
      del?.remove();
    } else {
      cover?.classList.remove("hidden");
      del?.classList.remove("hidden");
    }
  });
}
function initDeleteButton(button) {
  const id = button.dataset.delete;
  if (!id) return;
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Kép törlése",
      message: "Biztosan törölni szeretnéd ezt a képet? Nem vonható vissza!",
      confirmText: "Törlés",
      cancelText: "Mégse"
    });
    if (!confirmed) return;
    try {
      await deleteImage(id);
      getWrapper(id)?.remove();
      updateGalleryButtons();
      showAlert("Törölve", "success");
    } catch {
      showAlert("Nem sikerült törölni a képet", "error");
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
    e.preventDefault();
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Borítókép beállítása",
      message: "Ezt a képet állítod be borítóképnek?",
      confirmText: "Beállítás",
      cancelText: "Mégse"
    });
    if (!confirmed) return;
    try {
      await setCoverImage(id, key);
      gallery.querySelectorAll("div[data-id]").forEach((w) => w.dataset.cover = "false");
      getWrapper(id).dataset.cover = "true";
      updateGalleryButtons();
      showAlert("Borítókép beállítva", "success");
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
    const wrappers = Array.from(
      gallery.querySelectorAll("div[data-id]")
    );
    const index = wrappers.indexOf(wrapper);
    if (index <= 0) return;
    const prev = wrappers[index - 1];
    await swapImageOrder(id, prev.dataset.id);
    prev.insertAdjacentElement("beforebegin", wrapper);
    updateGalleryButtons();
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
    const wrappers = Array.from(
      gallery.querySelectorAll("div[data-id]")
    );
    const index = wrappers.indexOf(wrapper);
    if (index >= wrappers.length - 1) return;
    const next = wrappers[index + 1];
    await swapImageOrder(id, next.dataset.id);
    next.insertAdjacentElement("afterend", wrapper);
    updateGalleryButtons();
  });
}
async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.sort((a, b) => a.sorting - b.sorting);
  for (const image of images) {
    const frag = template.content.cloneNode(true);
    const wrapper = frag.firstElementChild;
    wrapper.dataset.id = image.id;
    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.cover = image.cover ? "true" : "false";
    wrapper.querySelector("img")?.setAttribute("src", image.url);
    const del = wrapper.querySelector("[data-delete]");
    const cover = wrapper.querySelector("[data-cover]");
    const up = wrapper.querySelector("[data-move-up]");
    const down = wrapper.querySelector("[data-move-down]");
    del.dataset.delete = image.id;
    cover.dataset.cover = image.id;
    up.dataset.moveUp = image.id;
    down.dataset.moveDown = image.id;
    if (getEditMode()) {
      del?.classList.remove("hidden");
      cover?.classList.remove("hidden");
      up?.classList.remove("hidden");
      down?.classList.remove("hidden");
    }
    initDeleteButton(del);
    initCoverButton(cover);
    initMoveUpButton(up);
    initMoveDownButton(down);
    gallery.appendChild(wrapper);
  }
  updateGalleryButtons();
}
function updatePopoverButtons() {
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
      document.querySelector("[popover]:popover-open")?.hidePopover();
    }
  });
}
await initGallery();
updatePopoverButtons();

export { updateGalleryButtons };
