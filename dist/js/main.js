import { init as initContentManager } from "content-manager";
import { init as initAuth } from "auth";

function initAll() {
  initContentManager();
  initAuth();
}

document.addEventListener("DOMContentLoaded", initAll);
