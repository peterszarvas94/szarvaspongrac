import { getCurrentUser, isAuthenticated, login, logout } from "@scripts/db";

export function updateAuthForm() {
  const form = document.getElementById("login-form") as HTMLFormElement | null;
  if (!form) return;

  const emailInput = form.querySelector("#email") as HTMLInputElement;
  const passwordInput = form.querySelector("#password") as HTMLInputElement;
  const messageDiv = form.querySelector("#message") as HTMLDivElement;

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

  const controlledElements =
    document.querySelectorAll<HTMLElement>("[data-auth]");
  Array.from(controlledElements).forEach((element) => {
    if ((element.dataset.auth === "true") === isAuthenticated()) {
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

function init() {
  updateAuthForm();
  initLogoutButtons();
}

init();
