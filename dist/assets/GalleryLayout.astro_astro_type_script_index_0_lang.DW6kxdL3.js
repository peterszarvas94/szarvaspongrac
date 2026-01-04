import { getImageUrls, deleteImage, setCoverImage, reorderImages } from './db.B2Whiv5I.js';
import { getEditMode, showAlert } from './ProseLayout.astro_astro_type_script_index_0_lang.C-PKG11V.js';
import { confirm } from './confirm-dialog.CNJzHFJm.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.DLVaAOnU.js';

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
  button.addEventListener("click", async () => {
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
    gallery.querySelector(
      "div[data-id]:has(button[data-delete]:not([data-delete]))"
    )?.dataset.id ?? null;
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
function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll("[data-delete]");
  deleteButtons.forEach((button) => initDeleteButton(button));
}
function initCoverButtons() {
  const coverButtons = document.querySelectorAll("[data-cover]");
  coverButtons.forEach((button) => initCoverButton(button));
}
async function initGallery() {
  const gallery = getGallery();
  const template = getTemplate();
  if (!gallery || !template) return;
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.sort((a, b) => a.sorting - b.sorting);
  for (const image of images) {
    const element = template.content.cloneNode(true);
    const wrapper = element.firstElementChild;
    if (!wrapper) continue;
    wrapper.dataset.sorting = String(image.sorting);
    wrapper.dataset.id = image.id;
    if (getEditMode()) {
      wrapper.setAttribute("draggable", "true");
      wrapper.style.cursor = "move";
    }
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
let draggedItemId = null;
function addDragListeners(wrapper) {
  const gallery = getGallery();
  const id = wrapper.dataset.id;
  if (!id || !gallery) return;
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
    const allWrappers = gallery?.querySelectorAll("div[data-id]");
    allWrappers?.forEach((w) => {
      w.style.boxShadow = "";
    });
  });
  wrapper.addEventListener("dragover", (e) => {
    if (!getEditMode() || !draggedItemId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    wrapper.style.boxShadow = "0 4px 0 0 #3b82f6";
    wrapper.style.transition = "box-shadow 0.2s ease";
  });
  wrapper.addEventListener("dragleave", (e) => {
    if (!getEditMode() || !draggedItemId) return;
    wrapper.style.boxShadow = "";
  });
  wrapper.addEventListener("drop", async (e) => {
    if (!getEditMode() || !draggedItemId || !gallery) return;
    e.preventDefault();
    wrapper.style.boxShadow = "";
    const targetId = wrapper.dataset.id;
    if (!targetId || targetId === draggedItemId) return;
    try {
      const wrappers = gallery.querySelectorAll("div[data-id]");
      const items = Array.from(wrappers).map((w) => ({
        id: w.dataset.id,
        sorting: parseInt(w.dataset.sorting) || 0
      }));
      const draggedElement = gallery.querySelector(
        `div[data-id="${draggedItemId}"]`
      );
      const targetElement = wrapper;
      if (!draggedElement || !targetElement) return;
      targetElement.insertAdjacentElement("afterend", draggedElement);
      await reorderImages(draggedItemId, targetId, items);
      showAlert("Sorrend frissítve", "success");
      const updatedWrappers = gallery.querySelectorAll("div[data-id]");
      updatedWrappers.forEach((w, index) => {
        w.dataset.sorting = String(index + 1);
      });
    } catch (error) {
      showAlert("Nem sikerült frissíteni a sorrendet", "error");
      console.error("Error reordering images:", error);
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
  const wrappers = gallery.querySelectorAll("div[data-id]");
  wrappers.forEach(addDragListeners);
}
async function init() {
  await initGallery();
  initDeleteButtons();
  initCoverButtons();
  initPopover();
  initDragAndDrop();
}
init();
