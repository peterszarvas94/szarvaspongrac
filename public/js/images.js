import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);

function initUploadForms() {
  /** @type {NodeListOf<HtmlFormElement>} */
  const uploadForms = document.querySelectorAll("[data-upload]");
  uploadForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const batch = pb.createBatch();
      const formData = new FormData(event.currentTarget);
      const files = formData.getAll("files");

      const key = form.dataset.upload;

      files.forEach((file) => {
        batch.collection("image").create({
          key,
          file,
        });
      });

      try {
        await batch.send();
        alert("Sikeres feltöltés");
      } catch (error) {
        alert("Nem sikerült a feltöltés");
        console.error("Upload error:", error);
      }
    });
  });
}

function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll("[data-delete]");
  deleteButtons.forEach((button) => {
    const image = button.dataset.delete;
    button.addEventListener("click", () => {
      console.log("deleting: ", image);
    });
  });
}

function updateAll() {
  initUploadForms();
  initDeleteButtons();
}

export function init() {
  // first update on load
  updateAll();

  // dev server page nav
  document.addEventListener("astro:page-load", updateAll);
}

init();
