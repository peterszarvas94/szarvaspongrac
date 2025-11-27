import PocketBase from "pocketbase";
import { PB_URL } from "env";

const pb = new PocketBase(PB_URL);

/**
 * Logs in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Auth data including user info
 * TODO: replace this with normal REST
 */
async function login(email, password) {
  try {
    await pb.collection("users").authWithPassword(email, password);
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

/**
 * @returns {boolean} True if authenticated
 */
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

/**
 * Updates the admin page UI based on authentication status
 */
function updateAdminUI() {
  const loginSection = document.getElementById("login-section");
  const userSection = document.getElementById("user-section");
  const userEmail = document.getElementById("user-email");
  const logoutBtn = document.getElementById("logout-btn");

  if (!loginSection || !userSection) return;

  if (isAuthenticated()) {
    const user = getCurrentUser();

    loginSection.classList.add("hidden");
    userSection.classList.remove("hidden");

    if (userEmail) userEmail.textContent = user.email;

    if (logoutBtn) {
      logoutBtn.addEventListener(
        "click",
        async () => {
          await logout();

          setTimeout(() => updateAdminUI(), 100);
        },
        { once: true },
      );
    }
  } else {
    loginSection.classList.remove("hidden");
    userSection.classList.add("hidden");
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
