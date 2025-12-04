import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);
let dt = new DataTransfer();

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
  updateFileList([...dt.files]);
}

/** @param {File[]} files */
function updateFileList(files) {
  const fileList = /** @type {HTMLUListElement} */ (
    document.querySelector("[data-files]")
  );
  fileList.innerHTML = "";

  const template = /** @type {HTMLTemplateElement} */ (
    document.querySelector("#file-row")
  );

  files.forEach((file) => {
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

function initUploadForm() {
  const uploadForm = /** @type {HTMLFormElement} */ (
    document.querySelector("[data-upload]")
  );

  const input = /** @type {HTMLInputElement} */ (
    document.querySelector("#file-upload")
  );

  input.addEventListener("change", () => {
    const newFiles = input.files ? Array.from(input.files) : [];

    newFiles.forEach((f) => {
      if (
        ![...dt.files].some(
          (existing) => existing.name === f.name && existing.size === f.size,
        )
      ) {
        dt.items.add(f);
      }
    });

    input.files = dt.files;
    updateFileList([...dt.files]);
  });

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    const files = /** @type {File[]} */ (formData.getAll("files"));

    if (files.length === 0 || files[0].name === "") {
      alert("Nincs kép kiválasztva");
      return;
    }

    const batch = pb.createBatch();
    const key = uploadForm.dataset.upload;

    files.forEach((file) => {
      batch.collection("image").create({
        key,
        file,
      });
    });

    try {
      await batch.send();
      alert("Sikeres feltöltés");
      dt = new DataTransfer();
      input.files = dt.files;
      updateFileList([]);
    } catch (error) {
      alert("Nem sikerült a feltöltés");
      console.error("Upload error:", error);
    }
  });
}

function initDeleteButtons() {
  /** @type {NodeListOf<HTMLButtonElement>} */
  const deleteButtons = document.querySelectorAll("[data-delete]");

  Array.from(deleteButtons).forEach((button) => {
    const image = button.dataset.delete;
    button.addEventListener("click", () => {
      console.log("deleting:", image);
    });
  });
}

function updateAll() {
  initUploadForm();
  initDeleteButtons();
}

export function init() {
  updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

init();
