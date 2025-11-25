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
  console.log("initAuthUI called");

  const form = /** @type {HTMLFormElement} */ (
    document.getElementById("login-form")
  );
  const emailInput = /** @type {HTMLInputElement} */ (
    document.getElementById("email")
  );
  const passwordInput = /** @type {HTMLInputElement} */ (
    document.getElementById("password")
  );
  const messageDiv = /** @type {HTMLElement} */ (
    document.getElementById("message")
  );

  console.log(
    "form:",
    form,
    "emailInput:",
    emailInput,
    "passwordInput:",
    passwordInput,
    "messageDiv:",
    messageDiv,
  );

  // Check if already logged in
  console.log("isAuthenticated:", isAuthenticated());
  if (isAuthenticated()) {
    const user = getCurrentUser();
    console.log("already logged in, user:", user);
    messageDiv.textContent = `Üdvözöljük, ${user?.email}!`;
    messageDiv.className = "mt-4 text-center text-success";
    form.style.display = "none";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("login attempt:", email);

    try {
      const authData = await login(email, password);
      console.log("Login successful:", authData);
      messageDiv.textContent = "Sikeres bejelentkezés!";
      messageDiv.className = "mt-4 text-center text-success";
      // Redirect to home
      setTimeout(() => {
        window.location.href = "/v2";
      }, 1000);
    } catch (error) {
      console.log("login error:", error);
      messageDiv.textContent = "Hibás email vagy jelszó.";
      messageDiv.className = "mt-4 text-center text-error";
    }
  });
}

/**
 * Initializes the header auth status
 */
export function initHeaderAuth() {
  console.log("initHeaderAuth called");

  function updateAuthStatus() {
    console.log("updateAuthStatus called, isAuthenticated:", isAuthenticated());
    const pb = getPocketBase();
    console.log(
      "authStore isValid:",
      pb.authStore.isValid,
      "model:",
      pb.authStore.model,
    );

    const authStatusDiv = document.getElementById("auth-status");
    console.log("authStatusDiv:", authStatusDiv);
    if (!authStatusDiv) return;

    if (isAuthenticated()) {
      const user = getCurrentUser();
      console.log("user:", user);
      authStatusDiv.classList.remove("hidden");

      const textSpan = authStatusDiv.querySelector("span");
      const newText = `Üvd ${user.email}`;
      textSpan.innerText = newText;
      console.log("textSpan:", newText);

      const btn = authStatusDiv.querySelector("button");
      btn.addEventListener("click", async () => {
        console.log("logout clicked");
        await logout();
        updateAuthStatus();
        window.location.reload();
      });
    } else {
      authStatusDiv.classList.add("hidden");
    }
  }

  // Update on load
  updateAuthStatus();
}

function initAuth() {
  // Init header auth if div exists
  const authStatusDiv = document.getElementById("auth-status");
  if (authStatusDiv) {
    initHeaderAuth();
  }

  // Init auth UI if form exists
  const form = document.getElementById("login-form");
  if (form) {
    initAuthUI();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}
