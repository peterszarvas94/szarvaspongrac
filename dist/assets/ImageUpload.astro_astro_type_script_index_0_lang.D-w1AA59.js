import { pb, getURLFromRecord } from './db.DXOn0jkR.js';
import { showAlert } from './ProseLayout.astro_astro_type_script_index_0_lang.COSNvfw1.js';
import { appendImage } from './GalleryLayout.astro_astro_type_script_index_0_lang.VL8CLJLL.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.DSCqf6hU.js';

const form = document.querySelector("[data-upload]");
const input = document.querySelector("#file-upload");
const label = document.querySelector(
  "label[for='file-upload']"
);
let dt = new DataTransfer();
function appendFilesToDt(newFiles) {
  newFiles.forEach((f) => {
    const isDuplicate = [...dt.files].some(
      (existing) => existing.name === f.name && existing.size === f.size
    );
    if (!isDuplicate) dt.items.add(f);
  });
}
function removeFile(file) {
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
  const template = document.querySelector("#file-row");
  if (!fileList || !template) return;
  fileList.innerHTML = "";
  [...dt.files].forEach((file) => {
    const row = template.content.cloneNode(true);
    const span = row.querySelector("span");
    const button = row.querySelector("button");
    if (span) span.textContent = file.name;
    if (button) button.onclick = () => removeFile(file);
    fileList.appendChild(row);
  });
}
function updateFiles(files) {
  if (!input) return;
  appendFilesToDt(files);
  input.files = dt.files;
  updateFileList();
}
function updateLabelClasses(active) {
  const div = label?.querySelector("div");
  if (!div) return;
  div.classList.toggle("border-base-300", !active);
  div.classList.toggle("border-base-content", active);
}
function getMaxSortingFromGallery() {
  const gallery = document.querySelector("[data-images]");
  if (!gallery) return 0;
  const items = gallery.querySelectorAll("div[data-sorting]");
  let maxSorting = 0;
  items.forEach((item) => {
    const sorting = parseInt(item.dataset.sorting ?? "0", 10);
    if (sorting > maxSorting) maxSorting = sorting;
  });
  return maxSorting;
}
function clearFileInput() {
  dt = new DataTransfer();
  if (input) input.files = dt.files;
  updateFileList();
}
async function uploadFiles(key, files) {
  const maxSorting = getMaxSortingFromGallery();
  const results = await Promise.allSettled(
    files.map(
      (file, index) => pb.collection("image").create(
        { key, file, sorting: maxSorting + index + 1 },
        { requestKey: null }
      )
    )
  );
  let successCount = 0;
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const record = result.value;
      appendImage({
        id: record.id,
        url: getURLFromRecord(record),
        sorting: maxSorting + index + 1
      });
      successCount++;
    } else {
      console.error("Upload error:", result.reason);
    }
  });
  clearFileInput();
  if (successCount === files.length) {
    showAlert("Sikeres feltöltés", "success");
  } else if (successCount > 0) {
    showAlert(`${successCount}/${files.length} kép feltöltve`, "warning");
  } else {
    showAlert("Nem sikerült a feltöltés", "error");
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
  updateFiles(Array.from(e.dataTransfer?.files ?? []));
});
input?.addEventListener("change", () => {
  updateFiles(input.files ? Array.from(input.files) : []);
});
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const files = new FormData(form).getAll("files");
  if (files.length === 0 || files[0].name === "") {
    showAlert("Nincs kép kiválasztva", "warning");
    return;
  }
  const key = form.dataset.upload;
  if (key) await uploadFiles(key, files);
});
