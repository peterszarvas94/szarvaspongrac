function initPopover() {
  console.log("innnnnit poppppp");
}

function updateAll() {
  initPopover();
}

export function init() {
  updateAll();
  document.addEventListener("astro:page-load", updateAll);
}

init();
