export let editMode = false;

function initEditButtons() {
  const editButtons = document.querySelectorAll("[data-edit]");
  // u get the idea...
}

function updateAll() {
  initEditButtons();
}

export function init() {
  updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

init();
