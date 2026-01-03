import { saveContent } from './db.CqHXNiAN.js';
import { updateContentsOnPage } from './content-manager.CHQSBTSA.js';
import './pocketbase.BNTe72gt.js';

class TypedEvent extends CustomEvent {
  constructor(eventName, detail) {
    super(eventName, {
      detail,
      bubbles: true,
      // optional: allows event to bubble
      composed: true
      // optional: allows crossing shadow DOM
    });
  }
}

class ToastEvent extends TypedEvent {
  static eventName = "toast";
  constructor(message, level = "info") {
    super(ToastEvent.eventName, { message, level });
  }
}
function showAlert(message, level = "info") {
  window.dispatchEvent(new ToastEvent(message, level));
}
const TOAST_DURATION = 3e3;
const levelClasses = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error"
};
function initToaster() {
  const container = document.querySelector("[data-toaster]");
  const template = document.querySelector("#toast-template");
  if (!container || !template) return;
  window.addEventListener(ToastEvent.eventName, ((e) => {
    const { message, level } = e.detail;
    const toast = template.content.cloneNode(true);
    const alertDiv = toast.querySelector(".alert");
    const span = toast.querySelector("span");
    const icons = toast.querySelectorAll("[data-icon]");
    alertDiv.classList.add(levelClasses[level]);
    span.textContent = message;
    icons.forEach((icon) => {
      if (icon.dataset.icon === level) {
        icon.classList.remove("hidden");
      }
    });
    const removeToast = () => {
      alertDiv.classList.add("opacity-0", "transition-opacity", "duration-300");
      setTimeout(() => alertDiv.remove(), 300);
    };
    alertDiv.addEventListener("click", removeToast);
    container.appendChild(toast);
    setTimeout(removeToast, TOAST_DURATION);
  }));
}
initToaster();

let editMode = false;
class EditModeEvent extends TypedEvent {
  static eventName = "editModeChanged";
  constructor(editMode2) {
    super(EditModeEvent.eventName, { editMode: editMode2 });
  }
  get editMode() {
    return this.detail.editMode;
  }
}
function getEditMode() {
  return editMode;
}
function setEditMode(value) {
  editMode = value;
  window.dispatchEvent(new EditModeEvent(value));
}
function toggleEditMode() {
  setEditMode(!editMode);
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
    if (showInEdit === editMode) {
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
window.addEventListener(EditModeEvent.eventName, updateEditUI);

export { EditModeEvent, getEditMode, showAlert };
