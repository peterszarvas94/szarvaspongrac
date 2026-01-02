import { saveContent } from "@scripts/db";
import { updateContentsOnPage } from "./content-manager";
import { TypedEvent } from "./event";
import { showAlert } from "./toaster";

export class EditModeEvent extends TypedEvent<{ editMode: boolean }> {
  static eventName = "editModeChanged";

  constructor(editMode: boolean) {
    super(EditModeEvent.eventName, { editMode });
  }

  get editMode() {
    return this.detail.editMode;
  }
}

export function getEditModeLS(): boolean {
  const stored = localStorage.getItem("editMode");
  return stored === "true";
}

function setEditMode(value: boolean) {
  localStorage.setItem("editMode", String(value));
  window.dispatchEvent(new EditModeEvent(value));
}

function toggleEditMode() {
  setEditMode(!getEditModeLS());
}

function initEditButtons() {
  const editButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", toggleEditMode);
  });
}

function updateEditUI() {
  const editElements = document.querySelectorAll<HTMLElement>("[data-edit]");

  editElements.forEach((element) => {
    const showInEdit = element.dataset.edit === "true";
    if (showInEdit === getEditModeLS()) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}

function parseDataAttr(
  value: string,
): { collection: string; key: string } | null {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}

function initSaveButtons() {
  const saveButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-save]");
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => handleSave(button));
  });
}

async function handleSave(button: HTMLButtonElement) {
  const parsed = parseDataAttr(button.dataset.save || "");
  if (!parsed || parsed.collection !== "content") return;

  const input = document.querySelector<HTMLInputElement>(
    `input[type='hidden'][name='${parsed.key}']`,
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
