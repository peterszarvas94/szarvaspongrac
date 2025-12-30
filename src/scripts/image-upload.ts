/// <reference types="astro/client" />
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);
let dt = new DataTransfer();

function appendFilesToDt(newFiles: File[]) {
  newFiles.forEach((f) => {
    if (
      ![...dt.files].some(
        (existing) => existing.name === f.name && existing.size === f.size,
      )
    ) {
      dt.items.add(f);
    }
  });
}

function replaceDtFiles(newFiles: File[]) {
  dt.items.clear();
  appendFilesToDt(newFiles);
}

function updateInputFiles(input: HTMLInputElement) {
  input.files = dt.files;
}

function updateLabelClasses(label: HTMLLabelElement, active: boolean) {
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

function removeFile(file: File) {
  const input = document.querySelector<HTMLInputElement>("#file-upload");
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
  const fileList = document.querySelector<HTMLUListElement>("[data-files]");
  if (!fileList) return;
  fileList.innerHTML = "";

  const template = document.querySelector<HTMLTemplateElement>("#file-row");
  if (!template) return;

  [...dt.files].forEach((file) => {
    const row = template.content.cloneNode(true) as DocumentFragment;
    const span = row.querySelector("span");
    const button = row.querySelector("button");

    if (span) span.textContent = file.name;
    if (button) button.onclick = () => removeFile(file);
    fileList.appendChild(row);
  });
}

function updateFiles(input: HTMLInputElement, files: File[]) {
  if (input.hasAttribute("multiple")) {
    appendFilesToDt(files);
  } else {
    replaceDtFiles([files[0]]);
  }

  updateInputFiles(input);
  updateFileList();
}

export async function uploadImage({ key, file }: { key: string; file: File }) {
  return await pb
    .collection("image")
    .create({ key, file })
    .catch((e) => {
      alert("Nem sikerült a feltöltés");
      console.error("Upload error:", e);
    });
}

async function replaceSingleItem(key: string, file: File) {
  try {
    const existing = await pb
      .collection("image")
      .getFirstListItem(`key='${key}'`)
      .catch(() => null);

    if (existing) {
      await pb
        .collection("image")
        .delete(existing.id)
        .catch((e) => {
          console.error("Delete error:", e);
        });
    }

    await uploadImage({ key, file });

    alert("Sikeres feltöltés");
    window.location.reload();
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

async function batchUpload(key: string, files: File[]) {
  const batch = pb.createBatch();
  files.forEach((file) => batch.collection("image").create({ key, file }));

  try {
    await batch.send();
    alert("Sikeres feltöltés");
    window.location.reload();
  } catch (e) {
    alert("Nem sikerült a feltöltés");
    console.error("Upload error:", e);
  }
}

function init() {
  const uploadForm = document.querySelector<HTMLFormElement>("[data-upload]");
  const input = document.querySelector<HTMLInputElement>("#file-upload");
  const label = document.querySelector<HTMLLabelElement>(
    "label[for='file-upload']",
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
    const files = formData.getAll("files") as File[];

    if (files.length === 0 || files[0].name === "") {
      alert("Nincs kép kiválasztva");
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

init();
document.addEventListener("astro:page-load", init);
