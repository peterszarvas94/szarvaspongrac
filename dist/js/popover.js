function initPopover() {
  console.log("initialized popover, todo...");
}

function updateAll() {
  initPopover();
}

export function init() {
  updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

init();
