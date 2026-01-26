/// <reference types="astro/client" />
import { pb } from "@scripts/db";
import { showAlert } from "@scripts/toaster";

const form = document.querySelector<HTMLFormElement>("[data-upload]");
const input = document.querySelector<HTMLInputElement>("#file-upload");
const label = document.querySelector<HTMLLabelElement>(
  "label[for='file-upload']",
);
const fileList = document.querySelector<HTMLUListElement>("[data-files]");
const template = document.querySelector<HTMLTemplateElement>("#file-row");

let dt = new DataTransfer();

function replaceFile(newFile: File) {
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
    await pb
      .collection("image")
      .create({ key, file, sorting: 0 }, { requestKey: null });
    showAlert("Sikeres feltöltés", "success");
  } catch (error) {
    showAlert("Nem sikerült a feltöltés", "error");
    console.error("Upload error:", error);
  }

  removeFile();
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
  if (key) await uploadFile(key, files[0]);
});
