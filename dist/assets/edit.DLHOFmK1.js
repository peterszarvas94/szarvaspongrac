import { s as saveContent } from './db.D1KCNAzE.js';
import { u as updateContentsOnPage } from './content-manager.DWZ6a-nb.js';

function getEditMode() {
  const stored = localStorage.getItem("editMode");
  return stored === "true";
}
function setEditMode(value) {
  localStorage.setItem("editMode", String(value));
}
function toggleEditMode() {
  setEditMode(!getEditMode());
}
function initEditButtons() {
  const editButtons = document.querySelectorAll("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleEditMode();
      updateEditUI();
    });
  });
}
function updateEditUI() {
  const editElements = document.querySelectorAll("[data-edit]");
  editElements.forEach((element) => {
    const showInEdit = element.dataset.edit === "true";
    if (showInEdit === getEditMode()) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}
function initSaveButtons() {
  const saveButtons = document.querySelectorAll(
    "[data-save-content]"
  );
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => handleSave(button));
  });
}
async function handleSave(button) {
  const key = button.dataset.saveContent;
  if (!key) return;
  const editor = document.querySelector(
    `[data-pb="content:${key}"]`
  );
  const input = editor?.querySelector("input[type='hidden']");
  if (!input) return;
  try {
    await saveContent(key, input.value);
    toggleEditMode();
    updateEditUI();
    await updateContentsOnPage();
  } catch (error) {
    console.error("Save failed:", error);
    alert("Mentés sikertelen");
  }
}
function initEdit() {
  initEditButtons();
  initSaveButtons();
  updateEditUI();
}
initEdit();
document.addEventListener("astro:page-load", initEdit);
