import { deleteImage, getImageUrls, setCoverImage } from "@scripts/db";
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

  for (const image of images) {
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

async function init() {
  await initGallery();
  initDeleteButtons();
  initCoverButtons();
  initPopover();
}

init();
