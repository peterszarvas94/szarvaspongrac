class TypedEvent extends CustomEvent {
  constructor(eventName, detail) {
    super(eventName, {
      detail,
      bubbles: true,
      // optional: allows event to bubble
      composed: true
      // optional: allows crossing shadow DOM
    });
  }
}

class ToastEvent extends TypedEvent {
  static eventName = "toast";
  constructor(message, level = "info") {
    super(ToastEvent.eventName, { message, level });
  }
}
function showAlert(message, level = "info") {
  window.dispatchEvent(new ToastEvent(message, level));
}
function testToaster() {
  showAlert("Info message", "info");
  showAlert("Success message", "success");
  showAlert("Warning message", "warning");
  showAlert("Error message", "error");
}
const TOAST_DURATION = 5e3;
const levelClasses = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error"
};
function initToaster() {
  const container = document.querySelector("[data-toaster]");
  const template = document.querySelector("#toast-template");
  if (!container || !template) return;
  window.addEventListener(ToastEvent.eventName, ((e) => {
    const { message, level } = e.detail;
    const toast = template.content.cloneNode(true);
    const alertDiv = toast.querySelector(".alert");
    const span = toast.querySelector("span");
    const icons = toast.querySelectorAll("[data-icon]");
    alertDiv.classList.add(levelClasses[level]);
    span.textContent = message;
    icons.forEach((icon) => {
      if (icon.dataset.icon === level) {
        icon.classList.remove("hidden");
      }
    });
    const removeToast = () => {
      alertDiv.classList.add("opacity-0", "transition-opacity", "duration-300");
      setTimeout(() => alertDiv.remove(), 300);
    };
    alertDiv.addEventListener("click", removeToast);
    container.appendChild(toast);
    setTimeout(removeToast, TOAST_DURATION);
  }));
}
initToaster();
document.addEventListener("astro:page-load", initToaster);

export { TypedEvent as T, showAlert as s, testToaster as t };
