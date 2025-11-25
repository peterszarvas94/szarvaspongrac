import PocketBase from "pocketbase";
import { PB_URL } from "env";

/** @type {PocketBase | null} */
let pbInstance = null;

/**
 * Gets or creates a PocketBase instance
 * @returns {PocketBase} The PocketBase instance
 */
function getPocketBase() {
  if (!pbInstance) {
    pbInstance = new PocketBase(PB_URL);
  }
  return pbInstance;
}

/**
 * Logs in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Auth data including user info
 */
async function login(email, password) {
  const pb = getPocketBase();
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return authData;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
async function logout() {
  const pb = getPocketBase();
  try {
    await pb.authStore.clear();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

/**
 * Checks if a user is authenticated
 * @returns {boolean} True if authenticated
 */
function isAuthenticated() {
  const pb = getPocketBase();
  return pb.authStore.isValid;
}

/**
 * Gets the current authenticated user
 * @returns {Object | null} User data or null
 */
function getCurrentUser() {
  const pb = getPocketBase();
  return pb.authStore.model;
}

export { login, logout, isAuthenticated, getCurrentUser };

/**
 * Initializes the auth UI for the login form
 */
export function initAuthUI() {
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

export async function init() {
  document.addEventListener("astro:page-load", updateAdminUI);

  initAuthUI();
  updateAdminUI();
}
