/// <reference types="astro/client" />
import { pb, getURLFromRecord } from "@scripts/db";
import { showAlert } from "./toaster";
import { getEditMode } from "./edit";
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

export async function uploadImage({
  key,
  file,
  sorting,
}: {
  key: string;
  file: File;
  sorting: number;
}) {
  return await pb
    .collection("image")
    .create({ key, file, sorting })
    .catch((e) => {
      showAlert("Nem sikerült a feltöltés", "error");
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

    await uploadImage({ key, file, sorting: 1 });

    showAlert("Sikeres feltöltés", "success");
    window.location.reload();
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

function getMaxSortingFromGallery(): number {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  if (!gallery) return 0;

  const items = gallery.querySelectorAll<HTMLDivElement>("div[data-sorting]");
  if (items.length === 0) return 0;

  let maxSorting = 0;
  items.forEach((item) => {
    const sorting = parseInt(item.dataset.sorting ?? "0", 10);
    if (sorting > maxSorting) {
      maxSorting = sorting;
    }
  });

  return maxSorting;
}

function appendImageToGallery(id: string, url: string, sorting: number) {
  const gallery = document.querySelector<HTMLDivElement>("[data-images]");
  const imageTemplate = document.querySelector<HTMLTemplateElement>(
    "template#image-gallery-item",
  );
  if (!gallery || !imageTemplate) return;

  const element = imageTemplate.content.cloneNode(true) as DocumentFragment;
  const wrapper = element.querySelector<HTMLDivElement>("div");
  if (wrapper) {
    wrapper.dataset.sorting = String(sorting);
    wrapper.dataset.id = id;
  }

  const img = element.querySelector("img");
  if (img) {
    img.setAttribute("src", url);
  }

  const deleteButton = element.querySelector<HTMLButtonElement>(
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
        deleteButton.closest("div")?.remove();
      } catch (error) {
        showAlert("Nem sikerült törölni a képet", "error");
        console.error({ msg: "Error deleting the image", id, error });
      }
    });
  }

  const coverButton =
    element.querySelector<HTMLButtonElement>("button[data-cover]");
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

  // Show edit buttons if in edit mode
  if (getEditMode()) {
    const editElements = element.querySelectorAll<HTMLElement>("[data-edit]");
    editElements.forEach((el) => el.classList.remove("hidden"));
  }

  gallery.appendChild(element);
}

async function batchUpload(key: string, files: File[]) {
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
      const url = getURLFromRecord(record);
      appendImageToGallery(record.id, url, maxSorting + index + 1);
      successCount++;
    } else {
      console.error("Upload error:", result.reason);
    }
  });

  // Clear the file input
  dt = new DataTransfer();
  const input = document.querySelector<HTMLInputElement>("#file-upload");
  if (input) input.files = dt.files;
  updateFileList();

  if (successCount === files.length) {
    showAlert("Sikeres feltöltés", "success");
  } else if (successCount > 0) {
    showAlert(`${successCount}/${files.length} kép feltöltve`, "warning");
  } else {
    showAlert("Nem sikerült a feltöltés", "error");
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

init();
