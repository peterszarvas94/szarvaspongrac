import { login, logout } from "@scripts/db";

function notifyAuthUpdated() {
  const body = document.body;
  if (body) {
    body.dispatchEvent(new Event("auth-updated"));
  }
}

function initAuthForm() {
  const form = document.getElementById("login-form") as HTMLFormElement | null;
  if (!form || form.dataset.authBound === "true") return;

  form.dataset.authBound = "true";

  const emailInput = form.querySelector("#email") as HTMLInputElement;
  const passwordInput = form.querySelector("#password") as HTMLInputElement;
  const messageDiv = form.querySelector("#message") as HTMLDivElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      await login(email, password);
      setTimeout(() => initLogoutButtons(), 100);
      notifyAuthUpdated();
    } catch (error) {
      messageDiv.textContent = "Hibás email vagy jelszó.";
      messageDiv.className = "mt-4 text-center text-error";
    }
  });
}

export function initLogoutButtons() {
  const logoutButtons =
    document.querySelectorAll<HTMLButtonElement>("[data-logout]");
  logoutButtons.forEach((button) => {
    if (button.dataset.logoutBound === "true") return;
    button.dataset.logoutBound = "true";

    button.addEventListener(
      "click",
      async () => {
        await logout();
        setTimeout(() => initLogoutButtons(), 100);
        notifyAuthUpdated();
      },
      { once: true },
    );
  });
}

initAuthForm();
initLogoutButtons();

document.body.addEventListener("htmx:afterSwap", () => {
  initAuthForm();
  initLogoutButtons();
});
