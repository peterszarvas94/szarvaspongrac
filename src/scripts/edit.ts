function getEditMode(): boolean {
  const stored = localStorage.getItem("editMode");
  return stored === "true";
}

function setEditMode(value: boolean) {
  localStorage.setItem("editMode", String(value));
}

let editMode = false;

function initEditButtons() {
  const editButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editMode = !editMode;
      setEditMode(editMode);
      updateEditUI();
    });
  });
}

function updateEditUI() {
  const editElements = document.querySelectorAll<HTMLElement>("[data-edit]");

  editElements.forEach((element) => {
    const showInEdit = element.dataset.edit === "true";
    if (showInEdit === editMode) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}

function initEdit() {
  editMode = getEditMode();
  initEditButtons();
  updateEditUI();
}

initEdit();
document.addEventListener("astro:page-load", initEdit);
