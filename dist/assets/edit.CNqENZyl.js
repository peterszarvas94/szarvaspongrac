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
  window.dispatchEvent(new CustomEvent("editModeChanged"));
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
function parseDataAttr(value) {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}
function initSaveButtons() {
  const saveButtons = document.querySelectorAll("[data-save]");
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => handleSave(button));
  });
}
async function handleSave(button) {
  const parsed = parseDataAttr(button.dataset.save || "");
  if (!parsed || parsed.collection !== "content") return;
  const input = document.querySelector(
    `input[type='hidden'][name='${parsed.key}']`
  );
  if (!input) return;
  try {
    await saveContent(parsed.key, input.value);
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
