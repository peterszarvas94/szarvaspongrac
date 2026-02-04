/// <reference types="astro/client" />
import {
  deleteImagesByKey,
  getImages,
  getURLFromRecord,
  pb,
} from "@scripts/db";
import { showAlert } from "@scripts/toaster";
import { handleError } from "@scripts/utils";
import { confirm } from "./confirm-dialog";

const form = document.querySelector<HTMLFormElement>("[data-upload]");
const input = document.querySelector<HTMLInputElement>("#file-upload");
const label = document.querySelector<HTMLLabelElement>(
  "label[for='file-upload']",
);
const fileList = document.querySelector<HTMLUListElement>("[data-files]");
const template = document.querySelector<HTMLTemplateElement>("#file-row");
const section = document.querySelector<HTMLElement>("[data-image]");

const userMessage = "Nem sikerült betölteni a háttérképet";

async function getHeroImage() {
  if (!section) {
    return;
  }

  const key = section.dataset.image;
  if (!key) {
    return;
  }

  const images = await getImages(key);
  if (images.length === 0) {
    return;
  }

  return images[0];
}

async function setSectionBackground(url: string, id: string) {
  if (!section) {
    return handleError(userMessage, "Hero section element not found.");
  }

  section.style.backgroundImage = `url("${url}")`;
  const downloadBtn =
    section.querySelector<HTMLButtonElement>("[data-download]");
  if (downloadBtn) downloadBtn.dataset.download = id;
}

let dt = new DataTransfer();

function replaceFile(newFile: File) {
  if (!newFile) {
    removeFile();
    return;
  }

  dt.items.clear();
  dt.items.add(newFile);
  updateInputFile();
  updateFileList();
}

function removeFile() {
  dt.items.clear();
  updateInputFile();
  updateFileList();
}

function updateFileList() {
  if (!fileList || !template) return;

  fileList.innerHTML = "";

  const file = dt.files[0];
  if (!file) return;

  const row = template.content.cloneNode(true) as DocumentFragment;
  const span = row.querySelector("span");
  const button = row.querySelector("button");

  if (span) span.textContent = file.name;
  if (button) button.onclick = () => removeFile();

  fileList.appendChild(row);
}

function updateInputFile() {
  if (!input) return;
  input.files = dt.files;
}

function updateLabelClasses(active: boolean) {
  const div = label?.querySelector("div");
  if (!div) return;

  div.classList.toggle("border-base-300", !active);
  div.classList.toggle("border-base-content", active);
}

async function uploadFile(key: string, file: File) {
  try {
    const image = await pb
      .collection("image")
      .create({ key, file, sorting: 0 }, { requestKey: null });

    showAlert("Sikeres feltöltés", "success");
    removeFile();

    return {
      id: image.id,
      url: getURLFromRecord(image),
      filename: image.file,
      cover: image.cover,
      sorting: image.sorting,
    };
  } catch (error) {
    removeFile();
    return handleError("Nem sikerült a feltöltés", "Upload failed.");
  }
}

label?.addEventListener("dragenter", (e) => {
  e.preventDefault();
  updateLabelClasses(true);
});

label?.addEventListener("dragover", (e) => {
  e.preventDefault();
  updateLabelClasses(true);
});

label?.addEventListener("dragleave", (e) => {
  e.preventDefault();
  updateLabelClasses(false);
});

label?.addEventListener("drop", (e) => {
  e.preventDefault();
  updateLabelClasses(false);
  replaceFile(Array.from(e.dataTransfer?.files ?? [])[0]);
});

input?.addEventListener("change", () => {
  replaceFile((input.files ? Array.from(input.files) : [])[0]);
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = new FormData(form).getAll("files") as File[];
  if (files.length === 0 || files[0].name === "") {
    showAlert("Nincs kép kiválasztva", "warning");
    return;
  }

  const key = form.dataset.upload;
  if (!key) return;

  const confirmed = await confirm({
    title: "Borítókép beállítása",
    message:
      "Biztosan ezt a képet állítod be borítóképnek? Az előző törölésre kerül.",
    confirmText: "Beállítás",
    cancelText: "Mégse",
  });
  if (!confirmed) return;

  await deleteImagesByKey(key);
  const uploadedImage = await uploadFile(key, files[0]);
  if (!uploadedImage) return;

  await setSectionBackground(uploadedImage.url, uploadedImage.id);
});

const image = await getHeroImage();

const url = image?.url;
const id = image?.id;

if (url && id) {
  await setSectionBackground(url, id);
}
