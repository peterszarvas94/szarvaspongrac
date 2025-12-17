import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);
let dt = new DataTransfer();

/** @param {File[]} newFiles */
function appendFilesToDt(newFiles) {
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

/** @param {File[]} newFiles */
function replaceDtFiles(newFiles) {
  dt.items.clear();
  appendFilesToDt(newFiles);
}

/** @param {HTMLInputElement} input */
function updateInputFiles(input) {
  input.files = dt.files;
}
/**
 * @param {HTMLLabelElement} label
 * @param {boolean} active
 */
function updateLabelClasses(label, active) {
  const div = /** @type {HTMLDivElement} */ (label.querySelector("div"));
  if (active) {
    div.classList.remove("border-base-300");
    div.classList.add("border-base-content");
  } else {
    div.classList.remove("border-base-content");
    div.classList.add("border-base-300");
  }
}

/** @param {File} file */
function removeFile(file) {
  const input = /** @type {HTMLInputElement} */ (
    document.querySelector("#file-upload")
  );

  const newDt = new DataTransfer();
  [...dt.files].forEach((f) => {
    if (f !== file) newDt.items.add(f);
  });

  dt = newDt;
  input.files = dt.files;
  updateFileList();
}

function updateFileList() {
  const fileList = /** @type {HTMLUListElement} */ (
    document.querySelector("[data-files]")
  );
  fileList.innerHTML = "";

  const template = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#file-row")
  );

  [...dt.files].forEach((file) => {
    const row = /** @type {DocumentFragment} */ (
      template.content.cloneNode(true)
    );

    const span = /** @type {HTMLSpanElement} */ (row.querySelector("span"));
    const button = /** @type {HTMLButtonElement} */ (
      row.querySelector("button")
    );

    span.textContent = file.name;
    button.onclick = () => removeFile(file);
    fileList.appendChild(row);
  });
}

/**
 * @param {HTMLInputElement} input
 * @param {File[]} files
 */
function updateFiles(input, files) {
  if (input.hasAttribute("multiple")) {
    appendFilesToDt(files);
  } else {
    replaceDtFiles([files[0]]);
  }

  updateInputFiles(input);
  updateFileList();
}

/**
 * @param {string} key
 * @param {File} file
 **/
async function replaceSingleItem(key, file) {
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

    await pb
      .collection("image")
      .create({ key, file })
      .catch((e) => {
        alert("Nem sikerült a feltöltés");
        console.error("Upload error:", e);
      });
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

/**
 * @param {string} key
 * @param {File[]} files
 **/
async function batchUpload(key, files) {
  const batch = pb.createBatch();

  files.forEach((file) => batch.collection("image").create({ key, file }));

  try {
    await batch.send();
    alert("Sikeres feltöltés");
    // TODO: append items in gallery instead of reloading
    window.location.reload();
  } catch (e) {
    alert("Nem sikerült a feltöltés");
    console.error("Upload error:", e);
  }
}

function initUploadForm() {
  const uploadForm = /** @type {HTMLFormElement} */ (
    document.querySelector("[data-upload]")
  );

  const input = /** @type {HTMLInputElement} */ (
    document.querySelector("#file-upload")
  );

  const label = /** @type {HTMLLabelElement} */ (
    document.querySelector("label[for='file-upload']")
  );

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

    let newFiles = Array.from(e.dataTransfer?.files ?? []);
    updateFiles(input, newFiles);
  });

  input.addEventListener("change", () => {
    const newFiles = input.files ? Array.from(input.files) : [];
    updateFiles(input, newFiles);
  });

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    const files = /** @type {File[]} */ (formData.getAll("files"));

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

async function updateAll() {
  initUploadForm();
}

export async function init() {
  await updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

await init();
