import PocketBase from "pocketbase";
import { PB_URL } from "env";

class ImageUploadComponent {
  /** @param {HTMLFormElement} uploadForm */
  constructor(uploadForm) {
    this.uploadForm = uploadForm;
    this.pb = new PocketBase(PB_URL);
    this.dt = new DataTransfer();

    this.initUploadForm();
  }

  /** @param {File[]} newFiles */
  appendFilesToDt(newFiles) {
    newFiles.forEach((f) => {
      if (
        ![...this.dt.files].some(
          (existing) => existing.name === f.name && existing.size === f.size,
        )
      ) {
        this.dt.items.add(f);
      }
    });
  }

  /** @param {File[]} newFiles */
  replaceDtFiles(newFiles) {
    this.dt.items.clear();
    this.appendFilesToDt(newFiles);
  }

  /** @param {HTMLInputElement} input */
  updateInputFiles(input) {
    input.files = this.dt.files;
  }

  /**
   * @param {HTMLLabelElement} label
   * @param {boolean} active
   */
  updateLabelClasses(label, active) {
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
  removeFile(file) {
    const input = /** @type {HTMLInputElement} */ (
      this.uploadForm.querySelector("#file-upload")
    );

    const newDt = new DataTransfer();
    [...this.dt.files].forEach((f) => {
      if (f !== file) newDt.items.add(f);
    });

    this.dt = newDt;
    input.files = this.dt.files;
    this.updateFileList();
  }

  updateFileList() {
    const fileList = /** @type {HTMLUListElement} */ (
      this.uploadForm.querySelector("[data-files]")
    );
    fileList.innerHTML = "";

    const template = /** @type {HTMLTemplateElement} */ (
      document.querySelector("#file-row")
    );

    [...this.dt.files].forEach((file) => {
      const row = /** @type {DocumentFragment} */ (
        template.content.cloneNode(true)
      );

      const span = /** @type {HTMLSpanElement} */ (row.querySelector("span"));
      const button = /** @type {HTMLButtonElement} */ (
        row.querySelector("button")
      );

      span.textContent = file.name;
      button.onclick = () => this.removeFile(file);
      fileList.appendChild(row);
    });
  }

  /**
   * @param {HTMLInputElement} input
   * @param {File[]} files
   */
  updateFiles(input, files) {
    if (input.hasAttribute("multiple")) {
      this.appendFilesToDt(files);
    } else {
      this.replaceDtFiles([files[0]]);
    }

    this.updateInputFiles(input);
    this.updateFileList();
  }

  /**
   * @param {string} key
   * @param {File} file
   **/
  async replaceSingleItem(key, file) {
    try {
      const existing = await this.pb
        .collection("image")
        .getFirstListItem(`key='${key}'`)
        .catch(() => null);

      if (existing) {
        await this.pb
          .collection("image")
          .delete(existing.id)
          .catch((e) => {
            console.error("Delete error:", e);
          });
      }

      await this.pb
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
  async batchUpload(key, files) {
    const batch = this.pb.createBatch();

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

  initUploadForm() {
    const input = /** @type {HTMLInputElement} */ (
      this.uploadForm.querySelector("#file-upload")
    );

    const label = /** @type {HTMLLabelElement} */ (
      this.uploadForm.querySelector("label[for='file-upload']")
    );

    label.addEventListener("dragenter", (e) => {
      e.preventDefault();
      this.updateLabelClasses(label, true);
    });

    label.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.updateLabelClasses(label, true);
    });

    label.addEventListener("dragleave", (e) => {
      e.preventDefault();
      this.updateLabelClasses(label, false);
    });

    label.addEventListener("drop", (e) => {
      e.preventDefault();
      this.updateLabelClasses(label, false);

      let newFiles = Array.from(e.dataTransfer?.files ?? []);
      this.updateFiles(input, newFiles);
    });

    input.addEventListener("change", () => {
      const newFiles = input.files ? Array.from(input.files) : [];
      this.updateFiles(input, newFiles);
    });

    this.uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(this.uploadForm);

      const files = /** @type {File[]} */ (formData.getAll("files"));

      if (files.length === 0 || files[0].name === "") {
        alert("Nincs kép kiválasztva");
        return;
      }

      const key = this.uploadForm.dataset.upload;
      if (!key) return;

      if (input.hasAttribute("multiple")) {
        await this.batchUpload(key, files);
      } else {
        await this.replaceSingleItem(key, files[0]);
      }
    });
  }
}

function initializeImageUploads() {
  document.querySelectorAll("[data-upload]").forEach((formElement) => {
    const form =
      /** @type {HTMLFormElement & { _imageUploadInstance?: ImageUploadComponent }} */ (
        formElement
      );
    if (!form._imageUploadInstance) {
      form._imageUploadInstance = new ImageUploadComponent(form);
    }
  });
}

export async function init() {
  initializeImageUploads();
  document.addEventListener("astro:page-load", initializeImageUploads);
}

await init();
