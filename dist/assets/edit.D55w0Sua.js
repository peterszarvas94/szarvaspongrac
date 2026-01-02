import { s as saveContent, u as updateContentsOnPage } from './content-manager.nW4rlnpy.js';
import { T as TypedEvent, s as showAlert } from './toaster.D4F-73sH.js';

class EditModeEvent extends TypedEvent {
  static eventName = "editModeChanged";
  constructor(editMode) {
    super(EditModeEvent.eventName, { editMode });
  }
  get editMode() {
    return this.detail.editMode;
  }
}
function getEditModeLS() {
  const stored = localStorage.getItem("editMode");
  return stored === "true";
}
function setEditMode(value) {
  localStorage.setItem("editMode", String(value));
  window.dispatchEvent(new EditModeEvent(value));
}
function toggleEditMode() {
  setEditMode(!getEditModeLS());
}
function initEditButtons() {
  const editButtons = document.querySelectorAll("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", toggleEditMode);
  });
}
function updateEditUI() {
  const editElements = document.querySelectorAll("[data-edit]");
  editElements.forEach((element) => {
    const showInEdit = element.dataset.edit === "true";
    if (showInEdit === getEditModeLS()) {
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
    await updateContentsOnPage();
    showAlert("Mentés sikeres", "success");
  } catch (error) {
    console.error("Save failed:", error);
    showAlert("Mentés sikertelen", "error");
  }
}
function initEdit() {
  initEditButtons();
  initSaveButtons();
  updateEditUI();
}
initEdit();
window.addEventListener("astro:page-load", initEdit);
window.addEventListener(EditModeEvent.eventName, updateEditUI);

export { EditModeEvent as E, getEditModeLS as g };
