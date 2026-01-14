import { getCurrentUser, isAuthenticated, login, logout } from "@scripts/db";

function notifyAuthUpdated() {
  const body = document.body;
  if (body) {
    body.dispatchEvent(new Event("auth-updated"));
  }
}

function initAuthForm() {
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
      notifyAuthUpdated();
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
        notifyAuthUpdated();
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
  }
}

initAuthForm();
initLogoutButtons();
