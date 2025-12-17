import { getCurrentUser, isAuthenticated, login, logout } from "db";

export function updateAuthForm() {
  const form =
    /** @type {HTMLFormElement | null} */
    (document.getElementById("login-form"));
  if (!form) return;

  const emailInput =
    /** @type {HTMLInputElement} */
    (form.querySelector("#email"));

  /** @type {HTMLInputElement} */
  const passwordInput =
    /** @type {HTMLInputElement} */
    (form.querySelector("#password"));

  /** @type {HTMLElement} */
  const messageDiv =
    /** @type {HTMLDivElement} */
    (form.querySelector("#message"));

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

export function initLogoutButtons() {
  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) =>
    button.addEventListener(
      "click",
      async () => {
        await logout();
        setTimeout(() => initLogoutButtons(), 100);
      },
      { once: true },
    ),
  );

  /** @type {NodeListOf<HTMLElement>} */
  const controlledElements = document.querySelectorAll("[data-auth]");
  Array.from(controlledElements).forEach((element) => {
    if ((element.dataset.auth === "true") === isAuthenticated()) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });

  if (isAuthenticated()) {
    /** @type {any} */
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

async function init() {
  updateAuthForm();
  initLogoutButtons();
}

init();
document.addEventListener("astro:page-load", init);
