import { login, logout, isAuthenticated, getCurrentUser } from './db.C5WFIfDw.js';
import './content-manager.Bcz9BLLz.js';
import './pocketbase.BNTe72gt.js';

function initAuthForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const messageDiv = form.querySelector("#message");
  if (document.getElementById("login-section")) {
    initLogoutButtons();
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
      await login(email, password);
      setTimeout(() => initLogoutButtons(), 100);
    } catch (error) {
      messageDiv.textContent = "Hibás email vagy jelszó.";
      messageDiv.className = "mt-4 text-center text-error";
    }
  });
}
function initLogoutButtons() {
  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach(
    (button) => button.addEventListener(
      "click",
      async () => {
        await logout();
        setTimeout(() => initLogoutButtons(), 100);
      },
      { once: true }
    )
  );
  const controlledElements = document.querySelectorAll("[data-auth]");
  Array.from(controlledElements).forEach((element) => {
    if (element.dataset.auth === "true" === isAuthenticated()) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
  if (isAuthenticated()) {
    const user = getCurrentUser();
    if (!user) {
      throw new Error(`Authenticated, but user is ${user}`);
    }
    const emailFields = document.querySelectorAll("[data-email]");
    emailFields.forEach((field) => {
      field.textContent = user.email;
    });
  }
}
initAuthForm();
initLogoutButtons();

const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const yearElement = document.querySelector("[data-copyright-year]");
const startYear = 2025;
if (yearElement) {
  if (currentYear === startYear) {
    yearElement.textContent = String(startYear);
  } else {
    yearElement.textContent = `${startYear}-${currentYear}`;
  }
}
