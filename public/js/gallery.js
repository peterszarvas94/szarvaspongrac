import PocketBase from "pocketbase";
import { PB_URL } from "env";
import { updateElements } from "auth";

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
      // dt = new DataTransfer();
      // input.files = dt.files;
      // updateFileList([]);
      window.location.reload();
    } catch (error) {
      alert("Nem sikerült a feltöltés");
      console.error("Upload error:", error);
    }
  });
}

/**
 * @param {string} key
 */
async function getImageUrls(key) {
  try {
    const images = await pb
      .collection("image")
      .getFullList({ filter: `key="${key}"` });

    return images.map((record) => ({
      id: record.id,
      url: pb.files.getURL(record, record.file),
      filename: record.file,
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

async function initImages() {
  const gallery = /**@type {HTMLDivElement}*/ (
    document.querySelector("[data-images]")
  );
  const imageTemplate = /**@type {HTMLTemplateElement}*/ (
    document.querySelector("template#image-gallery-item")
  );
  const key = gallery.dataset.images ?? "";
  const images = await getImageUrls(key);
  images.forEach((image) => {
    const element = /** @type {DocumentFragment} */ (
      imageTemplate.content.cloneNode(true)
    );
    const img = /** @type {HTMLImageElement} */ (element.querySelector("img"));
    img.setAttribute("src", image.url);
    gallery.appendChild(element);
  });

  updateElements();
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

async function updateAll() {
  initUploadForm();
  await initImages();
  initDeleteButtons();
}

export async function init() {
  await updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

await init();
