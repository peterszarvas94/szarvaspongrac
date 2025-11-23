import { updateElement } from "content-manager";

async function main() {
  const elements = document.querySelectorAll("[data-content]");

  for (const element of elements) {
    const key = element.getAttribute("data-content");
    if (key) {
      await updateElement(`[data-content="${key}"]`, key);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
