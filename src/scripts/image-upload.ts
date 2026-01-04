/// <reference types="astro/client" />
import { pb, getURLFromRecord } from "@scripts/db";
import { showAlert } from "./toaster";
import { getEditMode } from "./edit";

const form = document.querySelector<HTMLFormElement>("[data-upload]");
const input = document.querySelector<HTMLInputElement>("#file-upload");
const label = document.querySelector<HTMLLabelElement>(
  "label[for='file-upload']",
);

let dt = new DataTransfer();

function appendFilesToDt(newFiles: File[]) {
  newFiles.forEach((f) => {
    const isDuplicate = [...dt.files].some(
      (existing) => existing.name === f.name && existing.size === f.size,
    );
    if (!isDuplicate) dt.items.add(f);
  });
}

function removeFile(file: File) {
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
  const template = document.querySelector<HTMLTemplateElement>("#file-row");
  if (!fileList || !template) return;

  fileList.innerHTML = "";

  [...dt.files].forEach((file) => {
    const row = template.content.cloneNode(true) as DocumentFragment;
    const span = row.querySelector("span");
    const button = row.querySelector("button");

    if (span) span.textContent = file.name;
    if (button) button.onclick = () => removeFile(file);
    fileList.appendChild(row);
  });
}

function updateFiles(files: File[]) {
  if (!input) return;

  appendFilesToDt(files);
  input.files = dt.files;
  updateFileList();
}

function updateLabelClasses(active: boolean) {
  const div = label?.querySelector("div");
  if (!div) return;

  div.classList.toggle("border-base-300", !active);
  div.classList.toggle("border-base-content", active);
}

function getMaxSortingFromGallery(): number {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  if (!gallery) return 0;

  const items = gallery.querySelectorAll<HTMLDivElement>("div[data-sorting]");
  let maxSorting = 0;

  items.forEach((item) => {
    const sorting = parseInt(item.dataset.sorting ?? "0", 10);
    if (sorting > maxSorting) maxSorting = sorting;
  });

  return maxSorting;
}

function appendImageToGallery(id: string, url: string, sorting: number) {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  const template = document.querySelector<HTMLTemplateElement>(
    "template#image-gallery-item",
  );
  if (!gallery || !template) return;

  const element = template.content.cloneNode(true) as DocumentFragment;
  const wrapper = element.firstElementChild as HTMLDivElement | null;
  if (!wrapper) return;

  wrapper.dataset.sorting = String(sorting);
  wrapper.dataset.id = id;

  const img = wrapper.querySelector("img");
  img?.setAttribute("src", url);

  const deleteButton = wrapper.querySelector<HTMLButtonElement>(
    "button[data-delete]",
  );
  if (deleteButton) {
    deleteButton.setAttribute("data-delete", id);
    deleteButton.addEventListener("click", async () => {
      const { confirm } = await import("./confirm-dialog");
      const { deleteImage } = await import("@scripts/db");

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
        wrapper.remove();
      } catch (error) {
        showAlert("Nem sikerült törölni a képet", "error");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  }

  const coverButton =
    wrapper.querySelector<HTMLButtonElement>("button[data-cover]");
  if (coverButton) {
    coverButton.setAttribute("data-cover", id);
    coverButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const { confirm } = await import("./confirm-dialog");
      const { setCoverImage } = await import("@scripts/db");

      const confirmed = await confirm({
        title: "Borítókép beállítása",
        message: "Ezt a képet állítod be borítóképnek?",
        confirmText: "Beállítás",
        cancelText: "Mégse",
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
    wrapper
      .querySelectorAll<HTMLElement>("[data-edit]")
      .forEach((el) => el.classList.remove("hidden"));
  }

  gallery.appendChild(wrapper);
}

function clearFileInput() {
  dt = new DataTransfer();
  if (input) input.files = dt.files;
  updateFileList();
}

async function uploadFiles(key: string, files: File[]) {
  const maxSorting = getMaxSortingFromGallery();

  const results = await Promise.allSettled(
    files.map((file, index) =>
      pb
        .collection("image")
        .create(
          { key, file, sorting: maxSorting + index + 1 },
          { requestKey: null },
        ),
    ),
  );

  let successCount = 0;
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const record = result.value;
      appendImageToGallery(
        record.id,
        getURLFromRecord(record),
        maxSorting + index + 1,
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

  const files = new FormData(form).getAll("files") as File[];
  if (files.length === 0 || files[0].name === "") {
    showAlert("Nincs kép kiválasztva", "warning");
    return;
  }

  const key = form.dataset.upload;
  if (key) await uploadFiles(key, files);
});
