function isLocalhost() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function getEditMode(): boolean {
  const stored = localStorage.getItem("editMode");
  if (stored !== null) {
    return stored === "true";
  }
  return isLocalhost();
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
      console.log("Edit mode:", editMode);
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
  console.log("Edit mode:", editMode);
  initEditButtons();
  updateEditUI();
}

initEdit();
document.addEventListener("astro:page-load", initEdit);
