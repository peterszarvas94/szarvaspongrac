const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/db.CqHXNiAN.js","assets/pocketbase.BNTe72gt.js"])))=>i.map(i=>d[i]);
import { pb, getURLFromRecord } from './db.CqHXNiAN.js';
import { showAlert, getEditMode } from './ProseLayout.astro_astro_type_script_index_0_lang.C8bdA8EB.js';
import './pocketbase.BNTe72gt.js';
import './content-manager.CHQSBTSA.js';

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true               && deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

let dt = new DataTransfer();
function getInput() {
  return document.querySelector("#file-upload");
}
function appendFilesToDt(newFiles) {
  newFiles.forEach((f) => {
    const isDuplicate = [...dt.files].some(
      (existing) => existing.name === f.name && existing.size === f.size
    );
    if (!isDuplicate) dt.items.add(f);
  });
}
function removeFile(file) {
  const input = getInput();
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
  const input = getInput();
  if (!input) return;
  appendFilesToDt(files);
  input.files = dt.files;
  updateFileList();
}
function updateLabelClasses(label, active) {
  const div = label.querySelector("div");
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
function appendImageToGallery(id, url, sorting) {
  const gallery = document.querySelector("[data-images]");
  const template = document.querySelector(
    "template#image-gallery-item"
  );
  if (!gallery || !template) return;
  const element = template.content.cloneNode(true);
  const wrapper = element.firstElementChild;
  if (!wrapper) return;
  wrapper.dataset.sorting = String(sorting);
  wrapper.dataset.id = id;
  const img = wrapper.querySelector("img");
  img?.setAttribute("src", url);
  const deleteButton = wrapper.querySelector(
    "button[data-delete]"
  );
  if (deleteButton) {
    deleteButton.setAttribute("data-delete", id);
    deleteButton.addEventListener("click", async () => {
      const { confirm } = await __vitePreload(async () => { const { confirm } = await import('./confirm-dialog.CNJzHFJm.js');return { confirm }},true              ?[]:void 0);
      const { deleteImage } = await __vitePreload(async () => { const { deleteImage } = await import('./db.CqHXNiAN.js');return { deleteImage }},true              ?__vite__mapDeps([0,1]):void 0);
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
        wrapper.remove();
      } catch (error) {
        showAlert("Nem sikerült törölni a képet", "error");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  }
  const coverButton = wrapper.querySelector("button[data-cover]");
  if (coverButton) {
    coverButton.setAttribute("data-cover", id);
    coverButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const { confirm } = await __vitePreload(async () => { const { confirm } = await import('./confirm-dialog.CNJzHFJm.js');return { confirm }},true              ?[]:void 0);
      const { setCoverImage } = await __vitePreload(async () => { const { setCoverImage } = await import('./db.CqHXNiAN.js');return { setCoverImage }},true              ?__vite__mapDeps([0,1]):void 0);
      const confirmed = await confirm({
        title: "Borítókép beállítása",
        message: "Ezt a képet állítod be borítóképnek?",
        confirmText: "Beállítás",
        cancelText: "Mégse"
      });
      if (!confirmed) return;
      const key = gallery.dataset.images ?? "";
      try {
        await setCoverImage(id, key);
        showAlert("Borítókép beállítva", "success");
        window.location.reload();
      } catch (error) {
        showAlert("Nem sikerült beállítani a borítóképet", "error");
        console.error({ msg: "Error setting cover image", id, error });
      }
    });
  }
  if (getEditMode()) {
    wrapper.querySelectorAll("[data-edit]").forEach((el) => el.classList.remove("hidden"));
  }
  gallery.appendChild(wrapper);
}
function clearFileInput() {
  dt = new DataTransfer();
  const input = getInput();
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
      appendImageToGallery(
        record.id,
        getURLFromRecord(record),
        maxSorting + index + 1
      );
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
function init() {
  const form = document.querySelector("[data-upload]");
  const input = getInput();
  const label = document.querySelector(
    "label[for='file-upload']"
  );
  if (!form || !input || !label) return;
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
    updateFiles(Array.from(e.dataTransfer?.files ?? []));
  });
  input.addEventListener("change", () => {
    updateFiles(input.files ? Array.from(input.files) : []);
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = new FormData(form).getAll("files");
    if (files.length === 0 || files[0].name === "") {
      showAlert("Nincs kép kiválasztva", "warning");
      return;
    }
    const key = form.dataset.upload;
    if (key) await uploadFiles(key, files);
  });
}
init();
