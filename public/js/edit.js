let editMode = false;

function initEditButtons() {
  /** @type {NodeListOf<HTMLButtonElement>} */
  const editButtons = document.querySelectorAll("[data-edit-toggle]");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editMode = !editMode;
      updateEditUI();
    });
  });
}

function updateEditUI() {
  /** @type {NodeListOf<HTMLElement>} */
  const editElements = document.querySelectorAll("[data-edit]");
  editElements.forEach((element) => {
    const edit = element.dataset.edit;
    if (edit !== String(editMode)) {
      element.classList.add("hidden");
    }

    if (edit === String(editMode)) {
      element.classList.remove("hidden");
    }
  });
}

function updateAll() {
  initEditButtons();
  updateEditUI();
}

export function init() {
  updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

init();
