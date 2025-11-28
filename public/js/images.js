function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll("[data-delete]");
  deleteButtons.forEach((button) => {
    const image = button.dataset.delete;
    button.addEventListener("click", () => {
      console.log("deleting: ", image);
    });
  });
}

function updateAll() {
  initDeleteButtons();
}

export function init() {
  // first update on load
  updateAll();

  // dev server page nav
  document.addEventListener("astro:page-load", updateAll);
}

init();
