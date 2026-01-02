import { Client } from './pocketbase.BNTe72gt.js';
import { showAlert } from './ProseLayout.astro_astro_type_script_index_0_lang.FYDWtDCv.js';
import { getImageUrls, deleteImage } from './db.C-ak8QhB.js';
import './content-manager.CAHtmHGO.js';

const pb = new Client("https://pb.szarvaspongrac.hu");
let dt = new DataTransfer();
function appendFilesToDt(newFiles) {
  newFiles.forEach((f) => {
    if (![...dt.files].some(
      (existing) => existing.name === f.name && existing.size === f.size
    )) {
      dt.items.add(f);
    }
  });
}
function replaceDtFiles(newFiles) {
  dt.items.clear();
  appendFilesToDt(newFiles);
}
function updateInputFiles(input) {
  input.files = dt.files;
}
function updateLabelClasses(label, active) {
  const div = label.querySelector("div");
  if (!div) return;
  if (active) {
    div.classList.remove("border-base-300");
    div.classList.add("border-base-content");
  } else {
    div.classList.remove("border-base-content");
    div.classList.add("border-base-300");
  }
}
function removeFile(file) {
  const input = document.querySelector("#file-upload");
  if (!input) return;
  const newDt = new DataTransfer();
  [...dt.files].forEach((f) => {
    if (f !== file) newDt.items.add(f);
  });
  dt = newDt;
  input.files = dt.files;
  updateFileList();
}
function updateFileList() {
  const fileList = document.querySelector("[data-files]");
  if (!fileList) return;
  fileList.innerHTML = "";
  const template = document.querySelector("#file-row");
  if (!template) return;
  [...dt.files].forEach((file) => {
    const row = template.content.cloneNode(true);
    const span = row.querySelector("span");
    const button = row.querySelector("button");
    if (span) span.textContent = file.name;
    if (button) button.onclick = () => removeFile(file);
    fileList.appendChild(row);
  });
}
function updateFiles(input, files) {
  if (input.hasAttribute("multiple")) {
    appendFilesToDt(files);
  } else {
    replaceDtFiles([files[0]]);
  }
  updateInputFiles(input);
  updateFileList();
}
async function uploadImage({ key, file }) {
  return await pb.collection("image").create({ key, file }).catch((e) => {
    showAlert("Nem sikerült a feltöltés", "error");
    console.error("Upload error:", e);
  });
}
async function replaceSingleItem(key, file) {
  try {
    const existing = await pb.collection("image").getFirstListItem(`key='${key}'`).catch(() => null);
    if (existing) {
      await pb.collection("image").delete(existing.id).catch((e) => {
        console.error("Delete error:", e);
      });
    }
    await uploadImage({ key, file });
    showAlert("Sikeres feltöltés", "success");
    window.location.reload();
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}
async function batchUpload(key, files) {
  const batch = pb.createBatch();
  files.forEach((file) => batch.collection("image").create({ key, file }));
  try {
    await batch.send();
    showAlert("Sikeres feltöltés", "success");
    window.location.reload();
  } catch (e) {
    showAlert("Nem sikerült a feltöltés", "error");
    console.error("Upload error:", e);
  }
}
function init$1() {
  const uploadForm = document.querySelector("[data-upload]");
  const input = document.querySelector("#file-upload");
  const label = document.querySelector(
    "label[for='file-upload']"
  );
  if (!uploadForm || !input || !label) return;
  label.addEventListener("dragenter", (e) => {
    e.preventDefault();
    updateLabelClasses(label, true);
  });
  label.addEventListener("dragover", (e) => {
    e.preventDefault();
    updateLabelClasses(label, true);
  });
  label.addEventListener("dragleave", (e) => {
    e.preventDefault();
    updateLabelClasses(label, false);
  });
  label.addEventListener("drop", (e) => {
    e.preventDefault();
    updateLabelClasses(label, false);
    const newFiles = Array.from(e.dataTransfer?.files ?? []);
    updateFiles(input, newFiles);
  });
  input.addEventListener("change", () => {
    const newFiles = input.files ? Array.from(input.files) : [];
    updateFiles(input, newFiles);
  });
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const files = formData.getAll("files");
    if (files.length === 0 || files[0].name === "") {
      showAlert("Nincs kép kiválasztva", "warning");
      return;
    }
    const key = uploadForm.dataset.upload;
    if (!key) return;
    if (input.hasAttribute("multiple")) {
      await batchUpload(key, files);
    } else {
      await replaceSingleItem(key, files[0]);
    }
  });
}
init$1();

async function initGallery() {
  const gallery = document.querySelector("[data-images]");
  const imageTemplate = document.querySelector(
    "template#image-gallery-item"
  );
  if (!gallery || !imageTemplate) return;
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.forEach((image) => {
    const element = imageTemplate.content.cloneNode(true);
    const img = element.querySelector("img");
    if (img) img.setAttribute("src", image.url);
    const deleteButton = element.querySelector(
      "button[data-delete]"
    );
    if (deleteButton) deleteButton.setAttribute("data-delete", image.id);
    gallery.appendChild(element);
  });
}
function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll("[data-delete]");
  Array.from(deleteButtons).forEach((button) => {
    const id = button.dataset.delete;
    if (!id) {
      console.error("No image id for button", button);
      return;
    }
    button.addEventListener("click", async () => {
      const confirmed = window.confirm(
        "Törlöd ezt a képet? Nem vonható vissza!"
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
async function init() {
  await initGallery();
  initDeleteButtons();
  initPopover();
}
init();
