import { saveContent } from "@lib/db";
import { updateContentsOnPage } from "./content-manager";

function getEditMode(): boolean {
  const stored = localStorage.getItem("editMode");
  return stored === "true";
}

function setEditMode(value: boolean) {
  localStorage.setItem("editMode", String(value));
}

function toggleEditMode() {
  setEditMode(!getEditMode());
}

function initEditButtons() {
  const editButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleEditMode();
      updateEditUI();
    });
  });
}

function updateEditUI() {
  const editElements = document.querySelectorAll<HTMLElement>("[data-edit]");

  editElements.forEach((element) => {
    const showInEdit = element.dataset.edit === "true";
    if (showInEdit === getEditMode()) {
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
