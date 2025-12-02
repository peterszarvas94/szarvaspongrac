import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);

async function login(email, password) {
  try {
    await pb.collection("_superusers").authWithPassword(email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function logout() {
  try {
    pb.authStore.clear();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

function isAuthenticated() {
  return pb.authStore.isValid;
}

/**
 * @returns {Object | null} User data or null
 */
function getCurrentUser() {
  return pb.authStore.record;
}

export function updateAuthUI() {
  /** @type {HTMLFormElement} */
  const form = document.getElementById("login-form");
  if (!form) return;

  /** @type {HTMLFormElement} */
  const emailInput = form.querySelector("#email");

  /** @type {HTMLInputElement} */
  const passwordInput = form.querySelector("#password");

  /** @type {HTMLElement} */
  const messageDiv = form.querySelector("#message");

  if (document.getElementById("login-section")) {
    updateAdminUI();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      await login(email, password);
      setTimeout(() => updateAdminUI(), 100);
    } catch (error) {
      messageDiv.textContent = "Hibás email vagy jelszó.";
      messageDiv.className = "mt-4 text-center text-error";
    }
  });
}

function updateAdminUI() {
  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) =>
    button.addEventListener(
      "click",
      async () => {
        await logout();

        setTimeout(() => updateAdminUI(), 100);
      },
      { once: true },
    ),
  );

  const controlledElements = document.querySelectorAll("[data-auth]");
  controlledElements.forEach((element) => {
    if ((element.dataset.auth === "true") === isAuthenticated()) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });

  if (isAuthenticated()) {
    const user = getCurrentUser();
    const emailFields = document.querySelectorAll("[data-email]");
    emailFields.forEach((field) => {
      field.textContent = user.email;
    });
  }
}

async function updateAll() {
  updateAuthUI();
  updateAdminUI();
}

export async function init() {
  // first update on load
  updateAll();

  // dev server page nav
  document.addEventListener("astro:page-load", updateAll);
}

init();
